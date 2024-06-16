export async function fetchData(setData, setLoading) {
	try {
	  const res = await fetch('http://localhost:3000/data');
	  const rawData = await res.json();
	  setData(rawData);
	} catch (e) {
	  console.error("Error fetching data: ", e);
	} finally {
	  setLoading(false);
	}
  }
  