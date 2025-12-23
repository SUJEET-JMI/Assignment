import {
  addStation,
  checkStation,
  checkStationStep,
} from "../services/api";

const AddStation = () => {
  const submit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    await checkStation(data);
    await checkStationStep(data);
    await addStation(data);
    alert("Station submitted (moderation pending)");
  };

  return (
    <form onSubmit={submit} className="bg-gray-100 p-4 rounded mb-6">
      <h3 className="font-semibold mb-2">Add Radio Station</h3>
      <input name="name" placeholder="Name" className="input" />
      <input name="url" placeholder="Stream URL" className="input" />
      <input name="country" placeholder="Country" className="input" />
      <input name="language" placeholder="Language" className="input" />
      <input name="tags" placeholder="Tags" className="input" />
      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
};

export default AddStation;
