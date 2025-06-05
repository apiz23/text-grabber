import { LineShadowText } from "@/components/magicui/line-shadow-text";
import UploadImage from "@/components/upload-image";

export default function Home() {
	return (
		<div className="min-h-screen pt-36 pb-10 w-full bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
			<div className="px-4">
				<div className="text-center mb-12 space-y-6">
					<h1 className="text-balance text-5xl uppercase font-semibold leading-none tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl text-white">
						Text
						<LineShadowText className="md:ms-4 italic" shadowColor={"white"}>
							Grabber
						</LineShadowText>
					</h1>
					<h2 className="text-xl sm:text-2xl font-medium text-gray-400 max-w-2xl mx-auto">
						A powerful text grabber that extracts text and generates descriptions from
						images with high accuracy using advanced OCR technology
					</h2>
				</div>

				<UploadImage />

				<div className="mt-16 text-center text-gray-500 text-sm">
					<p>
						Supports English and other common languages, providing extracted text and
						a detailed description
					</p>
				</div>
			</div>
		</div>
	);
}
