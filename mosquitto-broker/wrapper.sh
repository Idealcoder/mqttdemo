#!/bin/sh

if [ ! -f $SNAP_USER_DATA/mosquitto.conf ]
then
    echo "Config file does not exist."
    echo "Creating default file in $SNAP_USER_DATA/mosquitto.conf"
    cp $SNAP/etc/mosquitto/mosquitto.conf $SNAP_USER_DATA/mosquitto.conf
fi

$SNAP/usr/local/sbin/mosquitto -c $SNAP_USER_DATA/mosquitto.conf

