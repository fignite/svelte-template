<script>
	async function onLoad(event) {
		var message = event.data.pluginMessage
		console.log(message)
	}
</script>

<svelte:window on:message={onLoad} />

<style global>

</style>
