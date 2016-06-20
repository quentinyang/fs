$(function() {
    $deploy = $('.deploy');
    $message = $('message', $deploy);
    var repository = $('.repository', $deploy).val();
    var deployment = $('.deployment', $deploy).val();
    var branch = $('.branch', $deploy).val();
    var platform = $('.platform', $deploy).val();

    $create = $('.button-create', $deploy);
    $rebuild = $('.button-rebuild', $deploy);

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
        
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: '/deploy/repository/rebuild',
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
                debugger;
                console.log('error')
            }
        });
    });

    $upload = $('.upload');
});