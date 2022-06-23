cd /home/orangepi/scripts

sudo rm init.sh -fr
touch init.sh
chmod +x init.sh

cat >> init.sh << EOF
#!/bin/bash

cd /udisk/gcode
if ls *.gcode > /dev/null 2>&1;then
    sudo cp ./* /home/orangepi/gcode_files -fr
    sudo rm ./* -fr
fi

EOF

