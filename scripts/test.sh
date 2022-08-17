#!/bin/bash




function test()
{
        temp=23
        echo ${temp}
}

nus=$(test)

echo -e "===-===${nus}"



function foo()
{ 
    echo $1
}


while true
do
    sleep 0.5
    echo "0 > value"
done