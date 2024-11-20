import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';
import { envconfig } from '../lib/envconfig';
// Tipado para la estructura del token si es necesario
interface AuthenticatedRequest extends Request {
  user?: any; // Puedes definir un tipo más específico para `user` según tu token
}

// Crear el cliente JWKS para obtener las claves públicas
const jwksClient = jwksRsa({
  jwksUri: `https://login.microsoftonline.com/${envconfig.AZURE_TENANT_ID}/discovery/v2.0/keys`,
  cache: true,
  rateLimit: true,
});

// Obtener la clave de firma
const getSigningKey = (kid: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwksClient.getSigningKey(kid, (err, key) => {
      if (err) {
        return reject(err);
      }
      resolve(key.getPublicKey());
    });
  });
};

// Middleware para validar el token
const validateAzureToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send('Authorization header missing');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send('Bearer token missing');
  }

  try {
    // Decodificar el encabezado del token para obtener `kid`
    const decodedHeader: jwt.JwtHeader = jwt.decode(token, { complete: true })?.header;
    if (!decodedHeader || !decodedHeader.kid) {
      throw new Error('Invalid token header');
    }

    // Obtener la clave pública asociada al `kid`
    const publicKey = await getSigningKey(decodedHeader.kid);

    // Verificar el token usando la clave pública
    const decodedToken = jwt.verify(token, publicKey, {
      audience: envconfig.AZURE_CLIENT_ID,
      issuer: `https://login.microsoftonline.com/${envconfig.AZURE_TENANT_ID}/v2.0`,
    });

    // Asignar el usuario decodificado a la solicitud
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token validation failed:', error);
    return res.status(401).send('Invalid token');
  }
};

export default validateAzureToken;
