import { jwtVerify, createRemoteJWKSet } from "jose";

export const authMiddleware = async function(c, next){
    const authHeader = c.req.header("Authorization");

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return c.json({
            message: "Missing Auth Header or invalid auth"
        }, 401);
    }

    const token = authHeader.split(" ")[1];

    try{
        //fetch keys from this URL
        const JWKS_URL = `https://${c.env.SUPABASE_PROJECT_ID}.supabase.co/auth/v1/.well-known/jwks.json`;
        const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

        const content = await jwtVerify(token, JWKS, {
            issuer: `https://${c.env.SUPABASE_PROJECT_ID}.supabase.co/auth/v1`,
            audience: "authenticated"
        });

        const customPayload = {
            uid: content.payload.sub,
            email: content.payload.email
        }

        c.set("meta", customPayload);
        await next();
    }
    catch(error){
        console.log({
            err: "JWT Verification Error",
            err_msg: error
        });

        return c.json({
            message: "Authentication failed"
        }, 401);
    }
}
