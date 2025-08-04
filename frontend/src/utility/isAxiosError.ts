// Create a type guard utility function
function isAxiosError(error: unknown): error is { response: { data: { message: string } } } {
  return typeof error === 'object' && error !== null && 'response' in error;
}

export default isAxiosError;