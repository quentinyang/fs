$(function() {
    (function() {
        // deploy
        var $deploy = $('.deploy');
        var $message = $('.message', $deploy);
        var repository = $('.repository', $deploy).val();
        var deployment = $('.deployment', $deploy).val();
        var branch = $('.branch', $deploy).val();
        var platform = $('.platform', $deploy).val();

        var $create = $('.button-create', $deploy);
        var $rebuild = $('.button-rebuild', $deploy);

        $create.on('click', function(e) {
            
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/deploy/repository/create',
                data: {
                    repository: repository,
                    branch: branch,
                    deployment: deployment,
                    platform: platform
                },
                success: function(data, event) {
                    $message.text('正在处理中');
                },
                error: function(e) {
                    console.log('error')
                }
            });
        });

        $rebuild.on('click', function(e) {
            rebuild({
                repository: repository,
                branch: branch,
                deployment: deployment,
                platform: platform
            }, function(data) {
                    $message.text('正在处理中');
            });
        });

    })();

    function rebuild(params, callback) {
        $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/deploy/repository/rebuild',
                data: {
                    repository: params.repository,
                    branch: params.branch,
                    deployment: params.deployment,
                    platform: params.platform
                },
                success: function(data, event) {
                    callback && callback(data);
                },
                error: function(e) {
                    console.log('error')
                }
            });
    }

    (function () {
        // upload
        $upload = $('.upload');
        $message = $('.message', $upload);
        var platform = $('.platform', $upload).val();

        $button = $('.button-upload', $upload);

        $button.on('click', function(e) {
            
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: `/deploy/repository/upload2cdn/${platform}`,
                data: {},
                success: function(data, event) {
                    $message.text('正在处理中');
                },
                error: function(e) {
                    console.log('error')
                }
            });
        });
    })();


    (function() {
        $deploymentList = $('.deployment-list');
        $rebuild = $('.rebuild', $deploymentList);
        function renderList(data) {
            var html = data || '';
            $deploymentList.html(html);
        }
        $.ajax({
            url: '/deploy/list.html',
            success: renderList,
            error: function(err){
                console.log('error', err);
            }
        })

        $deploymentList.on('click', '.rebuild', function(e) {
            var $target = $(e.target);
            var params = $target.data();

            rebuild({
                repository: params.repository,
                branch: params.branch,
                deployment: params.deployment,
                platform: params.platform
            }, function(data) {
                    $('.status span', $target.parent().parent()).text('正在处理中');
            });
            
        });

    })();
    

});