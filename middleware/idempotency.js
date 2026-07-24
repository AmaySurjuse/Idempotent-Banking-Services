import idempotency from "../models/idempotencyschema.js";

export const idempotencycheck = async (req, res, next) => {
    const idempotencykey = req.headers['idempotency-key']

    if(!idempotencykey){
        return res.status(400).json({
            success: false,
            message : "Idempotency key is required"
        })
    }

    try{
        const existingrequest = await idempotency.findOne({key : idempotencykey})

        if(existingrequest){

            return res.status(existingrequest.responsestatus).json(existingrequest.responsebody);
        }

        const originaljson = res.json

        res.json = function(body) {
            idempotency.create({
                key : idempotencykey,
                requestmethod : req.method,
                requestpath : req.originalUrl, 
                responsestatus : res.statusCode,
                
                responsebody : body 
            }).
            catch(err => console.error("failed to save key" , err))

            return originaljson.call(this, body)
        }

        next()
        
    }
    catch (error) {
        console.error("Idempotency Middleware Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error during security check." });
    }
}