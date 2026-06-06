function handleError({
  statusCode = 500,
  errorMessage = "An unexpected error occurred",
  errorList = [],
  stack = null,
  payloadData = null
} = {}) { // '= {}' allows calling handleError() with no arguments at all
  
  console.error(`[Error ${statusCode}]: ${errorMessage}`);
  
  if (errorList.length) console.table(errorList);
  if (stack) console.error(stack);
  if (payloadData) console.log("Context Data:", payloadData);
  
  // Add your global error logic here (e.g., Sentry, Express response, etc.)
}


/*


1. The Build-Step Solution: Use TypeScriptIf you want the compiler to strictly enforce specific parameter names and prevent you from passing the wrong keys, TypeScript handles this flawlessly using object types.typescripttype Config = { theme?: string; layout: string };

// TypeScript ensures only 'theme' and 'layout' can be passed
function setConfig({ theme = "light", layout }: Config) {
  console.log(theme, layout);
}

// Your IDE will throw an error if you type an incorrect parameter name
setConfig({ layout: "grid" });

===========================================================

2. The Functional Solution: Currying or Partial ApplicationIf you are forced to use a positional function from an external library, you can use a functional programming technique called currying or the native .bind() method. This allows you to lock in specific parameters ahead of time so you don't have to keep passing them or skipping them with undefined.javascript// Imagine a legacy library function you cannot change
function legacyLog(level, system, message) {
  console.log(`[${level}] [${system}] ${message}`);
}

// Lock in 'level' and 'system' using bind
const logCryptoError = legacyLog.bind(null, "Error", "CryptoSystem");

// Now you only need to pass the specific 'message' parameter
logCryptoError("Connection failed"); 
// Output: [Error] [CryptoSystem] Connection failed

===========================================================

3. The Pattern Solution: The Builder PatternFor highly complex configurations with many parameters, you can use a Builder Class. This completely removes the positional argument limitation by allowing you to chain specific parameter setters sequentially.javascriptclass RequestBuilder {
  setMethod(method) { this.method = method; return this; }
  setUrl(url) { this.url = url; return this; }
  setData(data) { this.data = data; return this; }
}

// Call specific parameters line-by-line in any order
const request = new RequestBuilder()
  .setUrl("/api/users")
  .setMethod("POST");





Pro-Tip: The "Wrapper" Factory TrickIf you find yourself repeatedly typing out the same status codes (like 400 for validation errors or 401 for auth errors), you don't need to pass them every time. You can create specialized wrapper functions:javascript// A factory wrapper for bad requests
const handleBadRequest = (msg, list = []) => 
  handleError({ statusCode: 400, errorMessage: msg, errorList: list });

// A factory wrapper for server crashes
const handleCrash = (err) => 
  handleError({ statusCode: 500, errorMessage: err.message, stack: err.stack });

// Usage:
handleBadRequest("Validation failed", ["Email is invalid", "Password too short"]);
handleCrash(new Error("Database disconnected"));



// middleware/errorHandler.js
export function errorHandler(err, req, res, next) {
  // Destructure your specific parameters directly from the err object, with fallback defaults
  const {
    statusCode = err.status || 500,
    errorMessage = err.message || "Internal Server Error",
    errorList = err.errors || [],
    stack = err.stack,
    payloadData = err.data || null
  } = err;

  // 1. Log the error details on the server console
  console.error(`[${req.method}] ${req.path} - Status: ${statusCode}`);
  console.error(`Message: ${errorMessage}`);
  
  if (errorList.length) console.error("Validation Errors:", errorList);
  if (payloadData) console.error("Payload Context:", JSON.stringify(payloadData));
  
  // Only leak stack traces in development mode
  if (process.env.NODE_ENV === "development" && stack) {
    console.error(stack);
  }

  // 2. Send a unified JSON response to the client
  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    ...(errorList.length && { errors: errorList }), // Only includes 'errors' if list is not empty
    ...(process.env.NODE_ENV === "development" && { stack }) // Only includes 'stack' in dev
  });
}

*/