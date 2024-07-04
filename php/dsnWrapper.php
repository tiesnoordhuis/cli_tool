<?php

function __dsnWrapper($originalDsn)
{
    $dsn = $originalDsn;
    # if the host is localhost or 127.0.0.1, replace it with mysql
    # mysql is the name of the service in the docker-compose file
    $dsn = preg_replace('/mysql:host=(localhost|127\.0\.0\.1)/', 'mysql:host=mysql', $dsn);
    return $dsn;
}