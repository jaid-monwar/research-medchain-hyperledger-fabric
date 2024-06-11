

# channel name defaults to "mychannel"
CHANNEL_NAME="medchannel"

echo $CHANNEL_NAME

# Generate Channel Genesis block
configtxgen -profile SixOrgsApplicationGenesis -configPath . -channelID $CHANNEL_NAME  -outputBlock ../../channel-artifacts/$CHANNEL_NAME.block

