import jwksClient from "jwks-rsa";

import EnvironmentConfigs from "./environments";

const options: any = {
  secret: jwksClient.expressJwtSecret({
    jwksUri: `${EnvironmentConfigs.getServerURL()}/.well-knows/public-jwk.json`,
    cache: true,
    rateLimit: true,
  }),
  algorithms: [EnvironmentConfigs.getJwtTokenAlgorithm()],
};

export default options;
