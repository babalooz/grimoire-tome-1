import { createContext, useContext } from "react";

// Modo AUDITORIA (prop `auditoria` de Licao/LicaoEsquete): fundo preto chapado, sem cenário/personagens/decoração,
// só interface e texto nas MESMAS posições. Qualquer pixel não-preto fora de SAFE (theme.ts) = violação de zona segura.
export const AuditCtx = createContext(false);
export const useAudit = () => useContext(AuditCtx);
export const AUDIT_BG = "#000";
