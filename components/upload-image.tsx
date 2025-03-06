"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";

export default function UploadImage() {
	const [image, setImage] = useState<File | null>(null);
	const [ocrResult, setOcrResult] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const { getRootProps, getInputProps } = useDropzone({
		accept: { "image/*": [] },
		onDrop: (acceptedFiles) => {
			setImage(acceptedFiles[0]);
			setOcrResult(null);
		},
	});

	const handleUpload = async () => {
		if (!image) return;
		setLoading(true);

		const formData = new FormData();
		formData.append("image", image);

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_PERSONAL_API}ocr/extract`,
				{
					method: "POST",
					body: formData,
				}
			);

			if (!response.ok) {
				throw new Error("Failed to extract text");
			}

			const data = await response.json();
			setOcrResult(data.text);
		} catch (error) {
			console.error("OCR Error:", error);
			setOcrResult("Failed to extract text.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-6xl mx-auto">
			<div
				{...getRootProps()}
				className="border-2 border-dashed p-6 text-center cursor-pointer rounded-2xl max-w-2xl mx-auto"
			>
				<Input {...getInputProps()} type="file" />
				<p className="text-gray-400">Drag & Drop image here or click to upload</p>
			</div>

			{image && (
				<>
					<div className="mt-4 flex gap-4">
						<div className="w-1/2">
							<Image
								src={URL.createObjectURL(image)}
								alt="Uploaded"
								className="w-fit h-[50vh] rounded-md mx-auto"
								height={720}
								width={720}
							/>
						</div>

						<div className="w-1/2">
							{ocrResult && (
								<div className="p-3 bg-gray-100 rounded h-full">
									<h3 className="font-bold text-gray-700">OCR Result:</h3>
									<p className="text-gray-600">{ocrResult}</p>
								</div>
							)}
						</div>
					</div>

					<div className="text-center">
						<Button
							variant="default"
							onClick={handleUpload}
							className="mt-4 px-4 py-2 rounded w-1/5"
						>
							{loading ? "Processing..." : "Extract Text"}
						</Button>
					</div>
				</>
			)}
		</div>
	);
}
