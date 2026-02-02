export async function deployViaImageUpdate(serviceId, imageName) {
  const query = `
    mutation ServiceUpdate($id: String!, $image: String!) {
      serviceUpdate(id: $id, input: {
        source: {
          image: $image
        }
      }) {
        id
        name
      }
    }
  `;

  try {
    console.log(`🚀 Orchestrator: Updating ${serviceId} to image ${imageName}...`);

    const response = await fetch("https://backboard.railway.app/graphql/v2", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RAILWAY_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          id: serviceId,
          image: imageName
        },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    console.log("✅ Railway: Image update successful. Deployment triggered!");
    return result.data.serviceUpdate;

  } catch (err) {
    console.error("❌ Orchestrator Pipeline Failed:", err.message);
    throw err;
  }
}