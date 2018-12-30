import testSpeed from './lib/test-speed'

const minute = 60000

function bootstrap() {
	triggerTest()
	setInterval(triggerTest, minute * 5)
}

function triggerTest() {
  testSpeed()
  	.catch(console.error)
}

bootstrap()
