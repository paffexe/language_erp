import { JwtPayload } from './admin.payload.types';

export type JwtPayloadWithRefreshToken = JwtPayload & { refreshToken: string };
