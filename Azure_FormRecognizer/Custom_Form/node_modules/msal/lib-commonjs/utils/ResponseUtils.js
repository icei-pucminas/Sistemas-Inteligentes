"use strict";
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Constants_1 = require("./Constants");
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
            case Constants_1.ResponseTypes.id_token:
                authResponse = tslib_1.__assign({}, authResponse, { tokenType: Constants_1.ServerHashParamKeys.ID_TOKEN, account: account, scopes: scopes, accountState: accountState });
                authResponse = ResponseUtils.setResponseIdToken(authResponse, idToken);
                return (authResponse.idToken) ? authResponse : null;
            case Constants_1.ResponseTypes.id_token_token:
                authResponse = ResponseUtils.setResponseIdToken(authResponse, idToken);
                return (authResponse && authResponse.accessToken && authResponse.idToken) ? authResponse : null;
            case Constants_1.ResponseTypes.token:
                authResponse = ResponseUtils.setResponseIdToken(authResponse, idToken);
                return authResponse;
            default:
                return null;
        }
    };
    return ResponseUtils;
}());
exports.ResponseUtils = ResponseUtils;
//# sourceMappingURL=ResponseUtils.js.map