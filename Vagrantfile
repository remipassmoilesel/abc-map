# -*- mode: ruby -*-
# vi: set ft=ruby :

$hostname = "ubuntu18lts"

Vagrant.configure("2") do |config|

  config.vm.box = "ubuntu/bionic64"

  config.vm.network :public_network
  config.vm.hostname = $hostname

  config.vm.provider "virtualbox" do |vb|
     vb.memory = "4096"
     vb.cpus = 6
  end

  config.vm.provision "shell", inline: <<-SHELL

    set -x

    echo "Current user for provisionning: $USER"

    # update system
    apt-get update && sudo apt-get upgrade -y

    # install helpers
    apt-get install -y python vim net-tools sed curl wget byobu ranger
    apt-get install -y language-pack-fr

    echo 'root:azerty' | chpasswd
    echo 'ubuntu:azerty' | chpasswd

    cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak

    # allow root login
    sed -i -E 's/#?PermitRootLogin.+/PermitRootLogin yes/g' /etc/ssh/sshd_config
    sed -i -E 's/#?PasswordAuthentication.+/PasswordAuthentication yes/g' /etc/ssh/sshd_config
    sed -i -E 's/#?UsePAM.+/UsePAM no/g' /etc/ssh/sshd_config

    systemctl restart ssh

    # show interfaces
    ip a

  SHELL

end
