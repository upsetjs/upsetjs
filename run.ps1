$curDir = Get-Location

Function run_function{
    Param($dir)
    Write-Output $dir.DirectoryName
    cd $dir.DirectoryName
    # git branch -D main

    # yarn set version latest
    ncu -u
    # yarn clean
    # yarn compile
    # yarn build
    # yarn fix
    # yarn test
    # git commit -am 'build: update deps'
    # git push
}

yarn set version latest
rm yarn.lock
ncu -u

Get-ChildItem -force packages/*/* | where {$_.name -eq "package.json"} | foreach {
    run_function $_
}
cd $curDir
Get-ChildItem -force examples/*/* | where {$_.name -eq "package.json"} | foreach {
    run_function $_
}
cd $curDir
