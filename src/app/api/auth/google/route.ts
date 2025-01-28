export async function POST() {
	return new Response(
		JSON.stringify({
			success: true,
			message: "Success POST"
		}),
		{
			status: 200
		}
	);
}
