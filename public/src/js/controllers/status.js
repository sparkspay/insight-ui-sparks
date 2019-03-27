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
      console.log(q);
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
      var data = []

      MasterNodesList.query(
        {},
        function(d) {
          angular.extend(data, d);
        },
        function(e) {
          $scope.error = "API ERROR: " + e.data;
        }
      );

      $scope.items = data;
      console.log(data);

    };
      /*
    $scope.getMembersList = function() {

      MasterNodesList.get(
        {},
        function(d) {
          $scope.tbOptions = {
            data: $scope.dset,
            aoColumns: [
              { mData: "ip" },
              { mData: "status" },
              { mData: "protocol" },
              { mData: "payee" },
              { mData: "vin" }
            ]
          }
        },
        function(e) {
          $scope.error = "API ERROR: " + e.data;
        },
        function() {
          
        }
      );

      var memURL = "http://localhost:3001/insight-api-sparks/masternodes/list";

      $http({
        method: "GET",
        url: memURL,
        headers: { "Content-Type": "application/json" }
      }).success(function(data, status, headers, config) {
        $scope.dset = data;

        $scope.tbOptions = {
          data: $scope.dset,
          aoColumns: [
            { mData: "ip" },
            { mData: "status" },
            { mData: "protocol" },
            { mData: "payee" },
            { mData: "vin" }
          ],
          aoColumnDefs: [
            {
              aTargets: [3],
              mRender: function(data, type, full) {
                return (
                  '<a href="mailto:' +
                  data +
                  '" style=color:red;>' +
                  data +
                  "</a>"
                );
              }
            },
            {
              aTargets: [1],
              mRender: function(data, type, full) {
                return (
                  '<a href="#/app/members/update-member/' +
                  full._id +
                  '" style=color:blue;>' +
                  data +
                  "</a>"
                );
              }
            }
          ]
        };
      });
     
    };
     */

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
