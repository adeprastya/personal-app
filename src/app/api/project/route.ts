export async function GET() {
	return new Response(
		JSON.stringify({
			success: true,
			message: "Success GET"
		}),
		{
			status: 200
		}
	);
}

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

export async function PATCH() {
	return new Response(
		JSON.stringify({
			success: true,
			message: "Success PATCH"
		}),
		{
			status: 200
		}
	);
}

export async function DELETE() {
	return new Response(
		JSON.stringify({
			success: true,
			message: "Success DELETE"
		}),
		{
			status: 200
		}
	);
}
