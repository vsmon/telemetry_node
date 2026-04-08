const os = require("os");

class ExternalIpService {
  async getExternalIpv6() {
    try {
      const response = await fetch("https://ifconfig.me/ip");
      const ipv6 = await response.text();
      return ipv6.trim(); // Retorna o IPv6 limpo
    } catch (error) {
      throw new Error(`Erro ao obter IPv6: ${error.message}`);
    }
  }

  // Opcional: Função para IPv4, se quiser centralizar
  async getExternalIpv4() {
    try {
      const response = await fetch("http://api.ipify.org/");
      const ipv4 = await response.text();
      return ipv4.trim();
    } catch (error) {
      throw new Error(`Erro ao obter IPv4: ${error.message}`);
    }
  }
  async getContainerIpv6() {
    const interfaces = os.networkInterfaces();

    for (const name in interfaces) {
      for (const iface of interfaces[name]) {
        // Regras de filtro:
        // 1. Deve ser IPv6
        // 2. Não pode ser interno (127.0.0.1 / ::1)
        // 3. Não pode ser Link-Local (fe80...) -> Esses não navegam na internet
        if (
          iface.family === "IPv6" &&
          !iface.internal &&
          !iface.address.startsWith("fe80")
        ) {
          return iface.address;
        }
      }
    }
    return new Error(
      `IPv6 não encontrado (verifique se o host tem IP global): ${error.message}`,
    );
    //return "IPv6 não encontrado (verifique se o host tem IP global)";
  }
}

module.exports = new ExternalIpService();
