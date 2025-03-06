import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { Spotlight } from "@/components/spotlight";
import UploadImage from "@/components/upload-image";

export default function Home() {
	return (
		<div className="min-h-screen pt-28 w-full bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden md:px-0 px-4">
			<Spotlight />
			<div className="text-center mb-8 space-y-5 text-white">
				<h1 className="text-balance text-5xl uppercase font-semibold leading-none tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
					Text
					<LineShadowText className="md:ms-4 italic" shadowColor="white">
						Grabber
					</LineShadowText>
				</h1>
				<h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 text-gray-500">
					Image to Text Converter
				</h2>
			</div>
			<UploadImage />
		</div>
	);
}
