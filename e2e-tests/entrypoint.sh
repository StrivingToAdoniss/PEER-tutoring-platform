#!/bin/sh

pytest --driver Remote --selenium-host ${SELENIUM_HOST} --selenium-port 4444 --capability browserName firefox
