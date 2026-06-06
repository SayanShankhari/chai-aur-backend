export const DB_NAME = "MyYoutube";
export const FILE_SIZE_LIMIT = "16kb";

export const HTTP_Status_Codes = {
	
}

/*

HTTP response status codes
HTTP response status codes indicate whether a specific HTTP request has been successfully completed. Responses are grouped in five classes:

Informational responses (100 – 199)
Successful responses (200 – 299)
Redirection messages (300 – 399)
Client error responses (400 – 499)
Server error responses (500 – 599)
The status codes listed below are defined by RFC 9110.

Note: If you receive a response that is not listed here, it is a non-standard response, possibly custom to the server's software.

In this article
Informational responses
Successful responses
Redirection messages
Client error responses
Server error responses
Browser compatibility
See also
Hetzner
Save on average: US$ 1,741.87/mo!
More traffic for less money with Hetzner Cloud.
Save now!
Ad
Informational responses
100 Continue
This interim response indicates that the client should continue the request or ignore the response if the request is already finished.

101 Switching Protocols
This code is sent in response to an Upgrade request header from the client and indicates the protocol the server is switching to.

102 Processing 
This code was used in WebDAV contexts to indicate that a request has been received by the server, but no status was available at the time of the response.

103 Early Hints
This status code is primarily intended to be used with the Link header, letting the user agent start preloading resources while the server prepares a response or preconnect to an origin from which the page will need resources.

Successful responses
200 OK
The request succeeded. The result and meaning of "success" depends on the HTTP method:

GET: The resource has been fetched and transmitted in the message body.
HEAD: Representation headers are included in the response without any message body.
PUT or POST: The resource describing the result of the action is transmitted in the message body.
TRACE: The message body contains the request as received by the server.
201 Created
The request succeeded, and a new resource was created as a result. This is typically the response sent after POST requests, or some PUT requests.

202 Accepted
The request has been received but not yet acted upon. It is noncommittal, since there is no way in HTTP to later send an asynchronous response indicating the outcome of the request. It is intended for cases where another process or server handles the request, or for batch processing.

203 Non-Authoritative Information
This response code means the returned metadata is not exactly the same as is available from the origin server, but is collected from a local or a third-party copy. This is mostly used for mirrors or backups of another resource. Except for that specific case, the 200 OK response is preferred to this status.

204 No Content
There is no content to send for this request, but the headers are useful. The user agent may update its cached headers for this resource with the new ones.

205 Reset Content
Tells the user agent to reset the document which sent this request.

206 Partial Content
This response code is used in response to a range request when the client has requested a part or parts of a resource.

207 Multi-Status (WebDAV)
Conveys information about multiple resources, for situations where multiple status codes might be appropriate.

208 Already Reported (WebDAV)
Used inside a <dav:propstat> response element to avoid repeatedly enumerating the internal members of multiple bindings to the same collection.

226 IM Used (HTTP Delta encoding)
The server has fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.

Redirection messages
300 Multiple Choices
In agent-driven content negotiation, the request has more than one possible response and the user agent or user should choose one of them. There is no standardized way for clients to automatically choose one of the responses, so this is rarely used.

301 Moved Permanently
The URL of the requested resource has been changed permanently. The new URL is given in the response.

302 Found
This response code means that the URI of requested resource has been changed temporarily. Further changes in the URI might be made in the future, so the same URI should be used by the client in future requests.

303 See Other
The server sent this response to direct the client to get the requested resource at another URI with a GET request.

304 Not Modified
This is used for caching purposes. It tells the client that the response has not been modified, so the client can continue to use the same cached version of the response.

305 Use Proxy 
Defined in a previous version of the HTTP specification to indicate that a requested response must be accessed by a proxy. It has been deprecated due to security concerns regarding in-band configuration of a proxy.

306 unused
This response code is no longer used; but is reserved. It was used in a previous version of the HTTP/1.1 specification.

307 Temporary Redirect
The server sends this response to direct the client to get the requested resource at another URI with the same method that was used in the prior request. This has the same semantics as the 302 Found response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the redirected request.

308 Permanent Redirect
This means that the resource is now permanently located at another URI, specified by the Location response header. This has the same semantics as the 301 Moved Permanently HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.

Client error responses
400 Bad Request
The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).

401 Unauthorized
Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.

402 Payment Required
The initial purpose of this code was for digital payment systems, however this status code is rarely used and no standard convention exists.

403 Forbidden
The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike 401 Unauthorized, the client's identity is known to the server.

404 Not Found
The server cannot find the requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 Forbidden to hide the existence of a resource from an unauthorized client. This response code is probably the most well known due to its frequent occurrence on the web.

405 Method Not Allowed
The request method is known by the server but is not supported by the target resource. For example, an API may not allow DELETE on a resource, or the TRACE method entirely.

406 Not Acceptable
This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content that conforms to the criteria given by the user agent.

407 Proxy Authentication Required
This is similar to 401 Unauthorized but authentication is needed to be done by a proxy.

408 Request Timeout
This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers use HTTP pre-connection mechanisms to speed up browsing. Some servers may shut down a connection without sending this message.

409 Conflict
This response is sent when a request conflicts with the current state of the server. In WebDAV remote web authoring, 409 responses are errors sent to the client so that a user might be able to resolve a conflict and resubmit the request.

410 Gone
This response is sent when the requested content has been permanently deleted from server, with no forwarding address. Clients are expected to remove their caches and links to the resource. The HTTP specification intends this status code to be used for "limited-time, promotional services". APIs should not feel compelled to indicate resources that have been deleted with this status code.

411 Length Required
Server rejected the request because the Content-Length header field is not defined and the server requires it.

412 Precondition Failed
In conditional requests, the client has indicated preconditions in its headers which the server does not meet.

413 Content Too Large
The request body is larger than limits defined by server. The server might close the connection or return a Retry-After header field.

414 URI Too Long
The URI requested by the client is longer than the server is willing to interpret.

415 Unsupported Media Type
The media format of the requested data is not supported by the server, so the server is rejecting the request.

416 Range Not Satisfiable
The ranges specified by the Range header field in the request cannot be fulfilled. It's possible that the range is outside the size of the target resource's data.

417 Expectation Failed
This response code means the expectation indicated by the Expect request header field cannot be met by the server.

418 I'm a teapot
The server refuses the attempt to brew coffee with a teapot.

421 Misdirected Request
The request was directed at a server that is not able to produce a response. This can be sent by a server that is not configured to produce responses for the combination of scheme and authority that are included in the request URI.

422 Unprocessable Content (WebDAV)
The request was well-formed but was unable to be followed due to semantic errors.

423 Locked (WebDAV)
The resource that is being accessed is locked.

424 Failed Dependency (WebDAV)
The request failed due to failure of a previous request.

425 Too Early 
Indicates that the server is unwilling to risk processing a request that might be replayed.

426 Upgrade Required
The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol. The server sends an Upgrade header in a 426 response to indicate the required protocol(s).

428 Precondition Required
The origin server requires the request to be conditional. This response is intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.

429 Too Many Requests
The user has sent too many requests in a given amount of time (rate limiting).

431 Request Header Fields Too Large
The server is unwilling to process the request because its header fields are too large. The request may be resubmitted after reducing the size of the request header fields.

451 Unavailable For Legal Reasons
The user agent requested a resource that cannot legally be provided, such as a web page censored by a government.

Server error responses
500 Internal Server Error
The server has encountered a situation it does not know how to handle. This error is generic, indicating that the server cannot find a more appropriate 5XX status code to respond with.

501 Not Implemented
The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore must not return this code) are GET and HEAD.

502 Bad Gateway
This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.

503 Service Unavailable
The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This response should be used for temporary conditions and the Retry-After HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.

504 Gateway Timeout
This error response is given when the server is acting as a gateway and cannot get a response in time.

505 HTTP Version Not Supported
The HTTP version used in the request is not supported by the server.

506 Variant Also Negotiates
The server has an internal configuration error: during content negotiation, the chosen variant is configured to engage in content negotiation itself, which results in circular references when creating responses.

507 Insufficient Storage (WebDAV)
The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.

508 Loop Detected (WebDAV)
The server detected an infinite loop while processing the request.

510 Not Extended
The client request declares an HTTP Extension (RFC 2774) that should be used to process the request, but the extension is not supported.

511 Network Authentication Required
Indicates that the client needs to authenticate to gain network access.






1xx informational response
An informational response indicates that the request was received and understood and is being processed. It alerts the client to wait for a final response. The message does not contain a body. As the HTTP/1.0 standard did not define any 1xx status codes, servers must not send a 1xx response to an HTTP/1.0 compliant client except under experimental conditions.

100 Continue
The server has received the request headers and the client should proceed to send the request body (in the case of a request for which a body needs to be sent, such as a POST request). Sending a large request body to a server after a request has been rejected for inappropriate headers would be inefficient. To have a server check the request's headers, a client must send Expect: 100-continue as a header in its initial request and receive a 100 Continue status code in response before sending the body. If the client receives an error code such as 403 (Forbidden) or 405 (Method Not Allowed) then it should not send the request's body. The response 417 Expectation Failed indicates that the request should be repeated without the Expect header as it indicates that the server does not support expectations (this is the case, for example, of HTTP/1.0 servers).[2]: §10.1.1 
101 Switching Protocols
The requester has asked the server to switch protocols and the server has agreed to do so.
102 Processing (WebDAV; RFC 2518)
A WebDAV request may contain many sub-requests involving file operations, requiring a long time to complete the request. This code indicates that the server has received and is processing the request, but no response is available yet.[3] This prevents the client from timing out and assuming the request was lost. The status code is deprecated.[4]
103 Early Hints (RFC 8297)
Used to return some response headers before final HTTP message.[5]
2xx success
A success status indicates that the action requested by the client was received, understood, and accepted.[1]

200 OK
Standard response for successful HTTP requests. The actual response will depend on the request method used. In a GET request, the response will contain an entity corresponding to the requested resource. In a POST request, the response will contain an entity describing or containing the result of the action.
201 Created
The request has been fulfilled, resulting in the creation of a new resource.[6]
202 Accepted
The request has been accepted for processing, but the processing has not been completed. The request might or might not be eventually acted upon, and may be disallowed when processing occurs.
203 Non-Authoritative Information (since HTTP/1.1)
The server is a transforming proxy (e.g. a Web accelerator) that received a 200 OK from its origin, but is returning a modified version of the origin's response.[2]: §15.3.4 [2]: §7.7 
204 No Content
The server successfully processed the request, and is not returning any content.
205 Reset Content
The server successfully processed the request, asks that the requester reset its document view, and is not returning any content.
206 Partial Content
The server is delivering only part of the resource (byte serving) due to a range header sent by the client. The range header is used by HTTP clients to enable resuming of interrupted downloads, or split a download into multiple simultaneous streams.
207 Multi-Status (WebDAV; RFC 4918)
The message body that follows is by default an XML message and can contain a number of separate response codes, depending on how many sub-requests were made.[7]
208 Already Reported (WebDAV; RFC 5842)
The members of a DAV binding have already been enumerated in a preceding part of the (multistatus) response, and are not being included again.
226 IM Used (RFC 3229)
The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.[8]
3xx redirection
A 3xx status indicates that the client must take additional action, generally URL redirection, to complete the request.[1] A user agent may carry out the additional action with no user interaction if the method used in the additional request is GET or HEAD. A user agent should prevent cyclical redirects.[2]: §15.4 

300 Multiple Choices
Indicates multiple options for the resource from which the client may choose (via agent-driven content negotiation). For example, this code could be used to present multiple video format options, to list files with different filename extensions, or to suggest word-sense disambiguation.
301 Moved Permanently
The link target was moved such that the request and future similar requests should be redirected to the given URI. If a client has link-editing capabilities, it should update references to the request URL. The response is cacheable unless indicated otherwise. Except for a GET request, the body should contain a hyperlink to the new URL(s). Except for a GET or HEAD request, the client must ask the user before redirecting.[9]
This code is considered best practice for upgrading users from HTTP to HTTPS. Both Bing and Google recommend using this code to change the URL of a page as it is shown in search engine results, providing that URL will permanently change and is not due to be changed again any time soon.[10][11]
302 Found
Indicates that the resource is accessible via an alternate URL indicated in the Location header field. The HTTP/1.0 specification (which used reason phrase "Moved Temporarily") required the client to redirect with the same method,[12] but popular browsers instead changed the request to GET.[13] For this reason, HTTP/1.1 (RFC 2616) added two status codes: 303 which requires changing the request to a GET and 307 which preserves the original request type. Despite the greater clarity provided by this disambiguation, the 302 code is still used in web frameworks to preserve compatibility with browsers that do not support HTTP/1.1.[14][2]: §15.4  As a consequence, RFC 7231 (the update of RFC 2616) changes the definition to allow user agents to rewrite POST to GET.[15]
303 See Other (since HTTP/1.1)
If a server responds to a POST or other non-idempotent request with this code and a location header field, the client is expected to issue a GET request to the specified location. To trigger a request to the target resource using the same method, the server responds with 307 instead.
Use of this code has been proposed[16] as one way of responding to a request for a URI that identifies a real-world object according to Semantic Web theory (the other being the use of hash URIs).[17][16] For example, if http://www.example.com/id/alice identifies a person, Alice, then it would be inappropriate for a server to respond to a GET request with 200 OK, as the server could not deliver Alice herself. Instead, the server would respond with 303 to redirect to a URI that provides a description of the person Alice.[16]
Sometimes, this code is used when providing an HTTP-based web API that needs to respond to the caller immediately, but continue executing asynchronously, such as a long-lived image conversion. The web API provides a status check URI that allows the client to check on the operation's status. When complete, the response may contain this status code and a redirect URI to the final result.[18]
304 Not Modified
Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match. In such case, there is no need to retransmit the resource since the client still has a previously-downloaded copy.
305 Use Proxy (since HTTP/1.1)
The requested resource is available only through a proxy, the address for which is provided in the response. For security reasons, many HTTP clients (such as Mozilla Firefox and Internet Explorer) do not obey this status code.[19]
306 Switch Proxy
No longer used. Originally meant "Subsequent requests should use the specified proxy."
307 Temporary Redirect (since HTTP/1.1)
In this case, the request should be repeated with another URI; however, future requests should still use the original URI. In contrast to how 302 was historically implemented, the request method is not allowed to be changed when reissuing the original request. For example, a POST request should be repeated using another POST request.
308 Permanent Redirect
This and all future requests should be directed to the given URI. 308 parallels the behavior of 301, but does not allow the HTTP method to change. So, for example, submitting a form to a permanently redirected resource may continue smoothly.
4xx client error
A The Wikimedia 404 message
404 error on Wikimedia
A 4xx status code is for situations in which an error seems to have been caused by the client. Except when responding to a HEAD request, the server should include an entity containing an explanation of the error situation, and whether it is a temporary or permanent condition. These status codes are applicable to any request method. User agents should display any included entity to the user.

400 Bad Request
The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, size too large, invalid request message framing, or deceptive request routing).
401 Unauthorized
Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided. The response must include a WWW-Authenticate header field containing a challenge applicable to the requested resource. See Basic access authentication and Digest access authentication. 401 semantically means "unauthenticated", the user does not have valid authentication credentials for the target resource.
402 Payment Required
Reserved for future use. The original intention was that this code might be used as part of some form of digital cash or micropayment scheme, as proposed, for example, by GNU Taler,[20] but that has not yet happened, and this code is not widely used. Google Developers API uses this status if a particular developer has exceeded the daily limit on requests.[21] Sipgate uses this code if an account does not have sufficient funds to start a call.[22] Shopify uses this code when the store has not paid their fees and is temporarily disabled.[23] Stripe uses this code for failed payments where parameters were correct, for example blocked fraudulent payments.[24] Cloudflare Turnstile uses this code when requesting resources with cURL. x402 is an open standard that repurposes the HTTP 402 "Payment Required" status code.
403 Forbidden
Main article: HTTP 403
The request was valid, but the server refuses action. This may be due to the user not having permission to a resource or needing an account of some sort, or attempting a prohibited action (e.g. creating a duplicate record where only one is allowed). This code is also typically used if the request provided authentication by answering the WWW-Authenticate header field challenge, but the server did not accept that authentication. The request should not be repeated.
This code differs from 401 in that while 401 is returned when the client has not authenticated, and implies that a successful response may be returned following valid authentication, 403 is returned when the client is not permitted access to the resource despite providing authentication such as insufficient permissions of the authenticated account.
The Apache web server returns 403 in response to a request for URL[25] paths that corresponded to a file system directory when directory listing is disabled and there is no Directory Index directive to specify an existing file to be returned to the browser. Some administrators configure the Mod proxy extension to block such requests and this will also return 403. IIS responds in the same way when directory listings are denied in that server. In WebDAV, 403 is returned if the client issued a PROPFIND request but did not also issue the required Depth header or issued a Depth header of infinity.[25]
404 Not Found
Main article: HTTP 404
The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.
405 Method Not Allowed
A request method is not supported for the requested resource (for example, a GET request on a form that requires data to be presented via POST, or a PUT request on a read-only resource).
406 Not Acceptable
The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request. See Content negotiation.
407 Proxy Authentication Required
The client must first authenticate itself with the proxy.
408 Request Timeout
The server timed out waiting for the request. According to HTTP specifications: "The client did not produce a request within the time that the server was prepared to wait. The client MAY repeat the request without modifications at any later time."
409 Conflict
Indicates that the request could not be processed because of conflict in the current state of the resource, such as an edit conflict between multiple simultaneous updates.[26]
410 Gone
Indicates that the resource requested was previously in use but is no longer available and will not be available again. This should be used when a resource has been intentionally removed and the resource should be purged. Upon receiving a 410 status code, the client should not request the resource in the future. Clients such as search engines should remove the resource from their indices. Most use cases do not require clients and search engines to purge the resource, and a "404 Not Found" may be used instead.
411 Length Required
The request did not specify the length of its content, which is required by the requested resource.
412 Precondition Failed
The server does not meet one of the preconditions that the requester put on the request header fields.
413 Content Too Large
The request is larger than the server is willing or able to process. Previously called "Request Entity Too Large" and "Payload Too Large".[27]: §10.4.14 [2]: §15.5.14 
414 URI Too Long
The URI provided was too long for the server to process. Often the result of too much data being encoded as a query-string of a GET request, in which case it should be converted to a POST request. Called "Request-URI Too Long" previously.[27]: §10.4.15 
415 Unsupported Media Type
The request entity has a media type which the server or resource does not support. For example, the client uploads an image as image/svg+xml, but the server requires that images use a different format.
416 Range Not Satisfiable
The client has asked for a portion of the file (byte serving), but the server cannot supply that portion. For example, if the client asked for a part of the file that lies beyond the end of the file. Called "Requested Range Not Satisfiable" previously.[27]: §10.4.17 
417 Expectation Failed
The server cannot meet the requirements of the Expect request-header field.[28]
418 I'm a teapot (RFC 2324, RFC 7168)
This code was defined in 1998 as one of the traditional IETF April Fools' jokes, in RFC 2324, Hyper Text Coffee Pot Control Protocol, and is not expected to be implemented by actual HTTP servers. The RFC specifies this code should be returned by teapots requested to brew coffee.[29] This HTTP status is used as an Easter egg in some websites, such as Google.com's "I'm a teapot" easter egg.[30][31] Sometimes, this status code is also used as a response to a blocked request, instead of the more appropriate 403 Forbidden.[32][33]
421 Misdirected Request
The request was directed at a server that is not able to produce a response (for example because of connection reuse).
422 Unprocessable Content
The request was well-formed (i.e., syntactically correct) but could not be processed.[2]: §15.5.21 
423 Locked (WebDAV; RFC 4918)
The resource that is being accessed is locked.[7]
424 Failed Dependency (WebDAV; RFC 4918)
The request failed because it depended on another request and that request failed (e.g., a PROPPATCH).[7]
425 Too Early (RFC 8470)
Indicates that the server is unwilling to risk processing a request that might be replayed.
426 Upgrade Required
The client should switch to a different protocol such as TLS/1.3, given in the Upgrade header field.
428 Precondition Required (RFC 6585)
The origin server requires the request to be conditional. Intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it, and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.[34]
429 Too Many Requests (RFC 6585)
The user has sent too many requests in a given amount of time. Intended for use with rate-limiting schemes.[34]
431 Request Header Fields Too Large (RFC 6585)
The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large.[34]
451 Unavailable For Legal Reasons (RFC 7725)
A server operator has received a legal demand to deny access to a resource or to a set of resources that includes the requested resource.[35] The code 451 was chosen as a reference to the novel Fahrenheit 451.[36]
See also: HTTP 451
5xx server error
5xx status indicates that the server is aware that it has encountered an error or is otherwise incapable of performing the request. Except when responding to a HEAD request, the server should include an entity containing an explanation of the error situation, and indicate whether it is a temporary or permanent condition. Likewise, user agents should display any included entity to the user. These response codes are applicable to any request method.

500 Internal Server Error
A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.
501 Not Implemented
The server either does not recognize the request method, or it lacks the ability to fulfil the request. Usually this implies future availability (e.g., a new feature of a web-service API).
502 Bad Gateway
The server was acting as a gateway or proxy and received an invalid response from the upstream server.
503 Service Unavailable
The server cannot handle the request (because it is overloaded or down for maintenance). Generally, this is a temporary state.[37]
504 Gateway Timeout
The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.
505 HTTP Version Not Supported
The server does not support the HTTP version used in the request.
506 Variant Also Negotiates (RFC 2295)
Transparent content negotiation for the request results in a circular reference.[38]
507 Insufficient Storage (WebDAV; RFC 4918)
The server is unable to store the representation needed to complete the request.[7]
508 Loop Detected (WebDAV; RFC 5842)
The server detected an infinite loop while processing the request (sent instead of 208 Already Reported).
510 Not Extended (RFC 2774)
Further extensions to the request are required for the server to fulfil it.[39]
511 Network Authentication Required (RFC 6585)
The client needs to authenticate to gain network access. Intended for use by intercepting proxies used to control access to the network (e.g., "captive portals" used to require agreement to Terms of Service before granting full Internet access via a Wi-Fi hotspot).[34]
Nonstandard codes
The following codes are used by various web servers but not specified by an IETF standard.

Internet Information Services
Microsoft's Internet Information Services (IIS) web server expands the 4xx error space to signal errors with the client's request. IIS sometimes uses additional decimal sub-codes for more specific information,[40] however these sub-codes only appear in the response payload and in documentation, not in the place of an actual HTTP status code.

440 Login Time-out
The client's session has expired and must log in again.[41]
449 Retry With
The server cannot honor the request because the user has not provided the required information.[42]
450 Blocked by Windows Parental Controls
Indicates that Windows Parental Controls block access to the requested webpage.[43]
451 Redirect
Used in Exchange ActiveSync when either a more efficient server is available or the server cannot access the users' mailbox.[44] The client is expected to re-run the HTTP AutoDiscover operation to find a more appropriate server.[45]
nginx
The nginx web server software expands the 4xx error space to signal issues with the client's request.[46][47]

444 No Response
Used internally[48] to instruct the server to return no information to the client and close the connection immediately.
494 Request header too large
Client sent too large request or too long header line.
495 SSL Certificate Error
An expansion of the 400 Bad Request response code, used when the client has provided an invalid client certificate.
496 SSL Certificate Required
An expansion of the 400 Bad Request response code, used when a client certificate is required but not provided.
497 HTTP Request Sent to HTTPS Port
An expansion of the 400 Bad Request response code, used when the client has made a HTTP request to a port listening for HTTPS requests.
499 Client Closed Request
Used when the client has closed the request before the server could send a response.
Cloudflare
Cloudflare's reverse proxy service expands the 5xx series of errors space to signal issues with the origin server.[49]

520 Web Server Returned an Unknown Error
The origin server returned an empty, unknown, or unexpected response to Cloudflare.[50]
521 Web Server Is Down
The origin server refused connections from Cloudflare. Security solutions at the origin may be blocking legitimate connections from certain Cloudflare IP addresses.[51]
522 Connection Timed Out
Cloudflare timed out contacting the origin server.[52]
523 Origin Is Unreachable
Cloudflare could not contact the origin server.[53]
524 A Timeout Occurred
Cloudflare was able to complete a TCP connection to the origin server, but the origin did not provide a timely HTTP response.[54]
525 SSL Handshake Failed
Cloudflare could not negotiate a SSL/TLS handshake with the origin server.[55][56]
526 Invalid SSL Certificate
Cloudflare could not validate the SSL certificate on the origin web server.[57][58] Also used by Cloud Foundry's gorouter.
527 Railgun Error (obsolete)
Error 527 indicated an interrupted connection between Cloudflare and the origin server's Railgun server.[59] This error is obsolete as Cloudflare has deprecated Railgun.
530 Origin Unavailable
Cloudflare was unable to resolve the origin hostname, preventing it from establishing a connection to the origin server. The body of the response contains an 1xxx error.[60][61]
AWS Elastic Load Balancing
Amazon Web Services' Elastic Load Balancing adds a few custom return codes to signal issues either with the client request or with the origin server.[62]

000
Returned with an HTTP/2 GOAWAY frame if the compressed length of any of the headers exceeds 8K bytes or if more than 10K requests are served through one connection.[62]
460
Client closed the connection with the load balancer before the idle timeout period elapsed. Typically, when client timeout is sooner than the Elastic Load Balancer's timeout.[62]
463
The load balancer received an X-Forwarded-For request header with more than 30 IP addresses.[62]
464
Incompatible protocol versions between Client and Origin server.[62]
561 Unauthorized
An error around authentication returned by a server registered with a load balancer. A listener rule is configured to authenticate users, but the identity provider (IdP) returned an error code when authenticating the user.[62]
Apache
Used by Apache HTTP Server.

509 Bandwidth Limit Exceeded
The server has exceeded the bandwidth specified by the server administrator; this is often used by shared hosting providers to limit the bandwidth of customers.[63] Also used by cPanel.
Laravel framework
Used by Laravel Framework.

419 Page Expired
A CSRF Token is missing or expired.[64]
Spring Framework
Used by Spring Framework.

420 Method Failure
A deprecated response status proposed during the development of WebDAV[65] used by the Spring Framework when a method has failed.[66]
Twitter
Used by Twitter.

420 Enhance Your Calm
Returned by version 1 of the Twitter Search and Trends API when the client is being rate limited; versions 1.1 and later use the 429 Too Many Requests response code instead.[67] The phrase "Enhance your calm" comes from the 1993 movie Demolition Man, and its association with this number is likely a reference to cannabis.[citation needed]
Shopify
Used by Shopify.

430 Request Header Fields Too Large
A deprecated response used by Shopify, instead of the 429 Too Many Requests response code, when too many URLs are requested within a certain time frame.[68]
430 Shopify Security Rejection
Used by Shopify to signal that the request was deemed malicious.[69]
530 Origin DNS Error
Indicates that Cloudflare can't resolve the requested DNS record.[69]
540 Temporarily Disabled
Indicates that the requested endpoint has been temporarily disabled.[69]
783 Unexpected Token
Indicates that the request includes a JSON syntax error.[69]
ArcGIS Server
Used by ArcGIS Server.

498 Invalid Token
Indicates an expired or otherwise invalid token.[70]
499 Token Required
Indicates that a token is required but was not submitted.[70]
cPanel
Used by cPanel.

508 Resource Limit Is Reached
Used instead of 503 when the server's account has exceeded the resources assigned to it, such as CPU/RAM usage or number of concurrent processes.[71]
SSLLabs server testing API
Used by Qualys in the SSLLabs server testing API.

529 Site is overloaded
Signals that the site can not process the request.[72]
Pantheon Systems web platform
Used by the Pantheon Systems web platform.

530 Site is frozen
Indicates a site that has been frozen due to inactivity.[73]
LinkedIn
Used by LinkedIn.

999 Request denied
Related to being blocked/walled or unable to access their webpages without first signing in.[74]
Miscellaneous
218 This is fine
An informal catch-all error condition, widely attributed to the Apache HTTP server to allow for the passage of message bodies through the server when the ProxyErrorOverride setting is enabled, though the status code and behavior is not part of any official Apache specification. The association between this status code and Apache has been attributed to unsourced additions to Wikipedia, which were subsequently picked up by other reference material, creating circular references.[75]
598 Network read timeout error
An informal convention used by some HTTP proxies to signal a network read timeout behind the proxy to a client in front of the proxy.[76]
599 Network Connect Timeout Error
An error used by some HTTP proxies to signal a network connect timeout behind the proxy to a client in front of the proxy.

*/