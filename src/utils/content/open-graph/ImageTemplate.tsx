interface Props {
  image: string;
  description: string;
  title: string;
  writtenTag: string;
  author: string;
  height: string;
  width: string;
}

export default function ImageTemplate(props: Props) {
  return (
    <div
      class="relative flex h-[630px] w-[1200px] flex-col items-center justify-center bg-cover py-8 font-sans text-slate-900"
      style={{ "background-image": `url("${props.image}")` }}
    >
      <div class="absolute inset-0 flex bg-black/30"></div>

      <div class="relative mx-auto flex w-full max-w-4xl flex-col rounded-lg border-2 border-blue-400 bg-blue-50 p-12">
        <p class="mb-8 text-xl text-slate-800">
          TaverasMisael <span class="font-semibold text-blue-800">Blog</span>
        </p>
        <h1 class="mb-6 text-5xl font-semibold">{props.title}</h1>
        <p class="mb-6 text-xl">{props.description}</p>
        <p>
          <span class="font-light">{props.writtenTag}</span> <strong class="ml-2 font-semibold">{props.author}</strong>
        </p>
      </div>
    </div>
  );
}
