
Output test1.mp4

Require echo

Set Shell "bash"
Set FontSize 24
Set Width 1200
Set Height 600

Type "soroban contract invoke \
--id CBBY3S6TITYPEYAJIYQREW6RGOE652CP2C5HDJ2G64F76QHCMGU6Y6CW \
--soure alice \
--network testnet \
-- \
increment
" 

Enter

Sleep 3s

Type "soroban contract invoke \
--id CBBY3S6TITYPEYAJIYQREW6RGOE652CP2C5HDJ2G64F76QHCMGU6Y6CW \
--soure alice \
--network testnet \
-- \
increment
" 
Sleep 3s

Type "soroban contract invoke \
--id CBBY3S6TITYPEYAJIYQREW6RGOE652CP2C5HDJ2G64F76QHCMGU6Y6CW \
--soure alice \
--network testnet \
-- \
increment
" 
Sleep 6s
