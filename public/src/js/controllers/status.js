"use strict";

angular
  .module("insight.status")
  .controller("StatusController", function(
    $scope,
    $routeParams,
    $location,
    Global,
    Status,
    Sync,
    MasterNodes,
    MasterNodesList,
    getSocket
  ) {
    $scope.global = Global;
    $scope.items = Global;

    $scope.getStatus = function(q) {
      Status.get(
        {
          q: "get" + q
        },
        function(d) {
          $scope.loaded = 1;
          angular.extend($scope, d);
        },
        function(e) {
          $scope.error = "API ERROR: " + e.data;
        }
      );
    };

    $scope.getMNStatus = function() {
      MasterNodes.get(
        {},
        function(d) {
          angular.extend($scope, d);
        },
        function(e) {
          $scope.error = "API ERROR: " + e.data;
        }
      );
    };

    $scope.getMNStatusList = function() {
      var data = [];
      var date = new Date(null);

      function pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
      }

      data = MasterNodesList.query();
      data.$promise.then(function(result) {
        for (key in result) {
          if (result[key].hasOwnProperty("activeseconds")) {
            var seconds = parseInt(result[key].activeseconds, 10);

            var days = Math.floor(seconds / (3600 * 24));
            seconds -= days * 3600 * 24;
            var hrs = Math.floor(seconds / 3600);
            seconds -= hrs * 3600;
            var mnts = Math.floor(seconds / 60);
            seconds -= mnts * 60;
            var ddhhmm = days + "d " + pad(hrs, 2) + ":" + pad(mnts, 2);
            result[key].activeseconds = ddhhmm;

            var row_color = "";

            switch (result[key].status) {
              case "ENABLED":
                row_color = "success";
                break;

              case "SENTINEL_PING_EXPIRED":
                row_color = "info";
                break;

              case "NEW_START_REQUIRED":
                row_color = "danger";
                break;

              case "UPDATE_REQUIRED":
                row_color = "warning";
                break;

              default:
                row_color = "";
                break;
            }

            angular.extend(result[key], { col: row_color });
          }
        }

        data = result;
      });

      $scope.items = data;

      /*

      MasterNodesList.query(
        {},
        function(d) {
          // angular.extend(data, d);

          //date.setSeconds(d.lastseen);
          //var lastseen_t = date.toISOString().substr(11,8);
          var simple = [];
          console.log(d);

          for (i in d) {
            if (i.isInteger) {
              if (d[i].activeseconds !== 0) {
                //date.setSeconds(d[i].activeseconds);
                //var activeseconds_t = date.toISOString().substr(11,8);
                var activeseconds_t = d[i].activeseconds;
                console.log(date.setSeconds(d[i].activeseconds) + '  :'+ i)
              } else {
                var activeseconds_t = d[i].activeseconds;
                console.log('false: '+i + ' :'+ d[i].activeseconds);
              }

              simple[i] = {
                ip: d[i].ip,
                status: d[i].status,
                protocol: d[i].protocol,
                activeseconds: activeseconds_t,
                lastseen: d[i].lastseen,
                payee: d[i].payee
              };
              angular.extend(data, simple);
            }
          }
        },
        function(e) {
          $scope.error = "API ERROR: " + e.data;
        }
      );
      */

      //$scope.items = data;
    };
 
    $scope.humanSince = function(time) {
      var m = moment.unix(time / 1000);
      return m.max().fromNow();
    };

    var _onSyncUpdate = function(sync) {
      $scope.sync = sync;
    };

    var _startSocket = function() {
      socket.emit("subscribe", "sync");
      socket.on("status", function(sync) {
        _onSyncUpdate(sync);
      });
    };

    var socket = getSocket($scope);
    socket.on("connect", function() {
      _startSocket();
    });

    $scope.getSync = function() {
      _startSocket();
      Sync.get(
        {},
        function(sync) {
          _onSyncUpdate(sync);
        },
        function(e) {
          var err = "Could not get sync information" + e.toString();
          $scope.sync = {
            error: err
          };
        }
      );
    };
  });
