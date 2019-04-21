"use strict";

angular
  .module("insight.status")
  .factory("Status", function($resource) {
    return $resource(window.apiPrefix + "/status", {
      q: "@q"
    });
  })
  .factory("Sync", function($resource) {
    return $resource(window.apiPrefix + "/sync");
  })
  .factory("PeerSync", function($resource) {
    return $resource(window.apiPrefix + "/peer");
  })
  .factory("MasterNodes", function($resource) {
    return $resource(window.apiPrefix + "/masternodes/list/info");
  })
  .factory("MasterNodesList", function($resource) {
    return $resource(window.apiPrefix + "/masternodes/list");
  })
  .factory("GuardianNodes", function($resource) {
    return $resource(window.apiPrefix + "/guardiannodes/list/info");
  })
  .factory("GuardianNodesList", function($resource) {
    return $resource(window.apiPrefix + "/guardiannodes/list");
  });;
