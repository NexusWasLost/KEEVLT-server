import { Hono } from "hono";
import { neon } from "@neondatabase/serverless";
import { HTTPException } from "hono/http-exception";

const updatekey = new Hono();

updatekey.patch("/api/update-key/:key_id", async function (c) {
    const keyId = c.req.param("key_id");
    if (!keyId)
        throw new HTTPException(400, { message: "Key Id not provided" });

    const { newServiceName, newAPIKeyName } = await c.req.json();
    if(!newServiceName || !newAPIKeyName)
        throw new HTTPException(400, { message: "Both new service name and API Key name must be provided" });

    const sql = neon(c.env.DATABASE_URL);
    const data = await sql.query(`
        UPDATE api_keys
        SET key_name = $1, service_name = $2 WHERE key_id = $3
        RETURNING *`,
        [newAPIKeyName, newServiceName, keyId]
    );

    if (data.length === 0) {
        throw new HTTPException(404, { message: "Key not found" });
    }

    return c.json({
        success: true,
        message: "Key Updated Successfully",
        data: {
            key_id: data[0].key_id,
            key_name: newAPIKeyName,
            service_name: newServiceName
        }
    }, 200);
});

export default updatekey;
