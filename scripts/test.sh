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

result=$(foo 33)

echo result is ${result}
