/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as tslib_1 from "tslib";
import { ResponseTypes, ServerHashParamKeys } from "./Constants";
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * @hidden
 */
var ResponseUtils = /** @class */ (function () {
    function ResponseUtils() {
    }
    ResponseUtils.setResponseIdToken = function (originalResponse, idTokenObj) {
        if (!originalResponse) {
            return null;
        }
        else if (!idTokenObj) {
            return originalResponse;
        }
        var exp = Number(idTokenObj.expiration);
        if (exp && !originalResponse.expiresOn) {
            originalResponse.expiresOn = new Date(exp * 1000);
        }
        return tslib_1.__assign({}, originalResponse, { idToken: idTokenObj, idTokenClaims: idTokenObj.claims, uniqueId: idTokenObj.objectId || idTokenObj.subject, tenantId: idTokenObj.tenantId });
    };
    ResponseUtils.buildAuthResponse = function (idToken, authResponse, serverAuthenticationRequest, account, scopes, accountState) {
        switch (serverAuthenticationRequest.responseType) {
            case ResponseTypes.id_token:
                authResponse = tslib_1.__assign({}, authResponse, { tokenType: ServerHashParamKeys.ID_TOKEN, account: account, scopes: scopes, accountState: accountState });
                authResponse = ResponseUtils.setResponseIdToken(authResponse, idToken);
                return (authResponse.idToken) ? authResponse : null;
            case ResponseTypes.id_token_token:
                authResponse = ResponseUtils.setResponseIdToken(authResponse, idToken);
                return (authResponse && authResponse.accessToken && authResponse.idToken) ? authResponse : null;
            case ResponseTypes.token:
                authResponse = ResponseUtils.setResponseIdToken(authResponse, idToken);
                return authResponse;
            default:
                return null;
        }
    };
    return ResponseUtils;
}());
export { ResponseUtils };
//# sourceMappingURL=ResponseUtils.js.map