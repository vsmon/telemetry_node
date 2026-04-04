const fetch = require("node-fetch");

async function updateCloudflareAccess(ipv4, ipv6) {
  try {
    const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
    const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
    const CF_POLICY_ID = process.env.CLOUDFLARE_POLICY_ID;

    //const newIp = `${ipv4}`;
    //const ipv6NetworkPrefix = ipv6.split(":").slice(0, 4).join(":") + "::/64";

    const payload = {
      name: "by IPs",
      decision: "bypass",
      include: [
        {
          ip: {
            ip: ipv4,
          },
        },
        {
          ip: {
            ip: ipv6,
          },
        },
      ],
      exclude: [],
      require: [],
      session_duration: "24h",
      approval_required: false,
      purpose_justification_required: false,
      isolation_required: false,
    };

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/access/policies/${CF_POLICY_ID}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${CF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json();

    if (!data.success) {
      console.error("Erro ao atualizar Cloudflare Access:", data.errors);
      return { success: false, errors: data.errors };
    }

    console.log("Cloudflare Access atualizado com:", [
      {
        externalIPv4: ipv4,
      },
      {
        externalIPv6: ipv6,
      },
    ]);
    return { success: true, payload };
  } catch (error) {
    console.error("Erro no updateCloudflareAccess:", error.message);
    return { success: false, error: error.message };
  }
}

module.exports = updateCloudflareAccess;
