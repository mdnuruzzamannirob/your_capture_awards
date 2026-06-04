import { toast } from 'sonner';

function extractMessage(value: unknown): string | undefined {
  if (!value) return undefined;

  if (typeof value === 'string') return value;

  if (typeof value !== 'object') return undefined;

  const record = value as Record<string, unknown>;
  const directMessage = record.message;
  if (typeof directMessage === 'string' && directMessage.trim()) {
    return directMessage;
  }

  const errorMessage = record.error;
  if (typeof errorMessage === 'string' && errorMessage.trim()) {
    return errorMessage;
  }

  const data = record.data;
  if (data && typeof data === 'object') {
    const nestedMessage = extractMessage(data);
    if (nestedMessage) return nestedMessage;
  }

  const err = record.err;
  if (err && typeof err === 'object') {
    const nestedMessage = extractMessage(err);
    if (nestedMessage) return nestedMessage;
  }

  const errorSources = record.errorSources;
  if (Array.isArray(errorSources)) {
    for (const source of errorSources) {
      if (!source || typeof source !== 'object') continue;

      const sourceRecord = source as { details?: unknown; message?: unknown };
      const sourceMessage =
        typeof sourceRecord.message === 'string' ? sourceRecord.message : undefined;
      if (sourceMessage?.trim()) return sourceMessage;

      const sourceDetails =
        typeof sourceRecord.details === 'string' ? sourceRecord.details : undefined;
      if (sourceDetails?.trim()) return sourceDetails;
    }
  }

  return undefined;
}

export function getErrorMessage(error: unknown, fallback: string) {
  return extractMessage(error) || fallback;
}

export function showErrorToast(error: unknown, fallback: string) {
  toast.error(getErrorMessage(error, fallback));
}
