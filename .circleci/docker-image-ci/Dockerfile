FROM ubuntu:18.04

USER root

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y software-properties-common \
    && apt-get install -y nodejs npm curl tzdata locales mongodb libxss1 \
    && npm i -g npm

RUN locale-gen fr_FR.UTF-8
ENV LANGUAGE="fr_FR.UTF-8"
ENV LC_ALL="fr_FR.UTF-8"
ENV LANG="fr_FR.UTF-8"

# Here we force timezone for tests
ENV TZ=Europe/Paris
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
        && echo $TZ > /etc/timezone \
        && echo "Europe/Paris" > /etc/timezone

