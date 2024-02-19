export class TokenStore {
  private tokens = new Map<string, { token: string; expiry: Date }>();

  setToken(scope: string, token: string, expiresIn: number) {
    const expiry = new Date(new Date().getTime() + expiresIn * 1000);
    this.tokens.set(scope, { token, expiry });
  }

  getToken(scope: string): string | null {
    const tokenInfo = this.tokens.get(scope);
    if (tokenInfo && new Date() < tokenInfo.expiry) {
      return tokenInfo.token;
    }
    return null;
  }
}
