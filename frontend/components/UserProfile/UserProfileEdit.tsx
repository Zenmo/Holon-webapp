type Props = {
  handleSubmit: (e: any) => void;
  name: string;
  email: string;
};

export default function UserProfileEdit({ handleSubmit, name, email }: Props) {
  return (
    <div className="">
      <form onSubmit={handleSubmit} data-testid="edit-profile-form" className="flex flex-col">
        <label htmlFor="name" className="block text-gray-700 text-lg font-bold mb-2">
          Naam:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          placeholder="Name"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
        <label htmlFor="email" className="block text-gray-700 text-lg font-bold mb-2 mt-8">
          E-mail:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          placeholder="E-mail"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />

        <button
          type="submit"
          className="border-holon-blue-900  text-white mt-8 w-44 bg-holon-blue-900 hover:bg-holon-blue-500 flex flex-row justify-center items-center relative rounded border-2 nowrap px-4 py-3 mb-4 min-w-[8rem] text-center font-medium leading-5 transition enabled:active:translate-x-holon-bh-x enabled:active:translate-y-holon-bh-y disabled:opacity-50">
          Profiel updaten
        </button>
      </form>
    </div>
  );
}
