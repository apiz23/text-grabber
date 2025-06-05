"use client";

import { ImageIcon, Loader2, ScanText, UploadCloud } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

export default function UploadImage() {
	const [image, setImage] = useState<File | null>(null);
	const [extractedText, setExtractedText] = useState<string | null>(null);
	const [description, setDescription] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const imageUrl = useMemo(() => {
		if (!image) return null;
		return URL.createObjectURL(image);
	}, [image]);

	useEffect(() => {
		return () => {
			if (imageUrl) {
				URL.revokeObjectURL(imageUrl);
			}
		};
	}, [imageUrl]);

	const { getRootProps, getInputProps } = useDropzone({
		accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
		maxFiles: 1,
		maxSize: 5 * 1024 * 1024,
		onDrop: (acceptedFiles) => {
			setExtractedText(null); 
			setDescription(null); 
			setImage(acceptedFiles[0]);
		},
		onDropRejected: () => {
			toast.error("File too large or invalid type. Max size: 5MB", {
				duration: 3000,
				description: "Please upload a valid image file (JPG, PNG, WEBP) under 5MB.",
			});
		},
	});

	const handleUpload = async () => {
		if (!image) return;
		setLoading(true);

		try {
			const formData = new FormData();
			formData.append("file", image);

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_PERSONAL_AI}extract-notes`,
				{
					method: "POST",
					body: formData,
				}
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to extract notes");
			}

			setExtractedText(data.extracted_text || "No text extracted from the image");
			setDescription(data.description || "No summary available");
			toast.success("Notes extracted successfully!", {
				duration: 3000,
				description: "The AI has summarized the image.",
			});
		} catch (err) {
			console.error("OCR Error:", err);
			toast.error("Failed to extract notes. Please try again.", {
				duration: 3000,
				description: "An error occurred during extraction.",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-6xl mx-auto px-4">
			{image && (
				<div className="mt-8 space-y-6">
					{/* Image Preview */}
					<div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800 shadow-md">
						<div className="flex items-center gap-2 mb-3 text-gray-300">
							<ImageIcon className="w-5 h-5" />
							<h3 className="font-medium">Uploaded Image</h3>
						</div>
						<div className="relative aspect-square w-full max-h-[60vh] rounded-md overflow-hidden border border-gray-800">
							{imageUrl ? (
								<Image
									src={imageUrl}
									alt="Uploaded"
									fill
									className="object-contain"
									priority
								/>
							) : (
								<div className="flex items-center justify-center h-full bg-gray-800/50 rounded-md">
									<p className="text-gray-500">No image selected</p>
								</div>
							)}
						</div>
					</div>

					{/* Extracted Text and Description */}
					<div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800 shadow-md">
						<div className="flex items-center gap-2 mb-3 text-gray-300">
							<ScanText className="w-5 h-5" />
							<h3 className="font-medium">Extracted Text</h3>
						</div>
						<div className="space-y-4">
							{/* Extracted raw text */}
							<div>
								<h4 className="text-sm font-semibold text-gray-400 mb-1">Raw Text:</h4>
								{loading ? (
									<div className="flex justify-center">
										<Loader2 className="w-5 h-5 animate-spin text-gray-400" />
									</div>
								) : extractedText ? (
									<textarea
										readOnly
										value={extractedText}
										className="w-full bg-gray-800/50 text-gray-300 rounded-md p-3 text-sm resize-none min-h-[120px] max-h-[300px] outline-none border border-gray-700"
									></textarea>
								) : (
									<p className="text-gray-500">No text extracted</p>
								)}
							</div>

							{/* Description/summary */}
							<div>
								<h4 className="text-sm font-semibold text-gray-400 mb-1">Summary:</h4>
								{loading ? (
									<div className="flex justify-center">
										<Loader2 className="w-5 h-5 animate-spin text-gray-400" />
									</div>
								) : description ? (
									<p className="text-sm text-gray-300 bg-gray-800/40 p-3 rounded-md border border-gray-700">
										{description}
									</p>
								) : (
									<p className="text-gray-500">No summary available</p>
								)}
							</div>
						</div>
					</div>

					<div className="flex justify-center gap-4">
						<Button
							variant="outline"
							onClick={() => {
								setImage(null);
								setExtractedText(null);
								setDescription(null);
							}}
							className="px-6 py-3"
							disabled={loading}
						>
							Clear
						</Button>
						<Button
							onClick={handleUpload}
							disabled={loading}
							className="px-6 py-3 gap-2 bg-primary hover:bg-primary/90 transition-colors"
						>
							{loading ? (
								<>
									<Loader2 className="w-4 h-4 animate-spin text-white" />
									Extracting...
								</>
							) : (
								<>
									<ScanText className="w-4 h-4 text-white" />
									Extract Text
								</>
							)}
						</Button>
					</div>
				</div>
			)}
			<div
				{...getRootProps()}
				className="border-2 border-dashed my-10 border-gray-700 hover:border-primary/50 transition-colors duration-300 p-8 text-center cursor-pointer rounded-2xl max-w-2xl mx-auto bg-gradient-to-b from-gray-900/50 to-gray-900/20 shadow-lg"
			>
				<div className="flex flex-col items-center justify-center space-y-3">
					<UploadCloud className="w-10 h-10 text-gray-400" />
					<Input {...getInputProps()} type="file" className="hidden" />
					<p className="text-gray-300 text-sm">
						Drag & drop an image here, or click to select
					</p>
					<p className="text-gray-500 text-xs">Supports JPG, PNG, WEBP (Max: 5MB)</p>
				</div>
			</div>
		</div>
	);
}
