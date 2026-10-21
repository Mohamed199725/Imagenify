import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { DeleteConfirmation } from "@/components/shared/DeleteConfirmation";
import Header from "@/components/shared/Header";
import TransformedImage from "@/components/shared/TransformedImage";
import { Button } from "@/components/ui/button";
import { transformationTypes } from "@/constants";
import { getImageById } from "@/lib/actions/image.actions";
import { getUserById } from "@/lib/actions/user.actions";

const ImageDetails = async ({ params }: SearchParamProps) => {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);
  const image = await getImageById(id);

  if (!image) redirect("/");

  const transformation =
    transformationTypes[image.transformationType as TransformationTypeKey];

  const isAuthor = user._id === image.author._id;

  return (
    <>
      <Header
        title={image.title}
        subtitle={transformation?.subTitle}
      />

      <section className="mt-5 flex flex-wrap gap-4">
        <div className="p-14-medium md:p-16-medium flex gap-2">
          <p className="text-dark-600">Transformation:</p>
          <p className="capitalize text-purple-400">
            {image.transformationType}
          </p>
        </div>

        {image.prompt && (
          <>
            <p className="hidden text-dark-400/50 md:block">&#x25CF;</p>
            <div className="p-14-medium md:p-16-medium flex gap-2">
              <p className="text-dark-600">Prompt:</p>
              <p className="capitalize text-purple-400">{image.prompt}</p>
            </div>
          </>
        )}

        {image.color && (
          <>
            <p className="hidden text-dark-400/50 md:block">&#x25CF;</p>
            <div className="p-14-medium md:p-16-medium flex gap-2">
              <p className="text-dark-600">Color:</p>
              <p className="capitalize text-purple-400">{image.color}</p>
            </div>
          </>
        )}

        {image.aspectRatio && (
          <>
            <p className="hidden text-dark-400/50 md:block">&#x25CF;</p>
            <div className="p-14-medium md:p-16-medium flex gap-2">
              <p className="text-dark-600">Aspect Ratio:</p>
              <p className="capitalize text-purple-400">{image.aspectRatio}</p>
            </div>
          </>
        )}
      </section>

      <section className="mt-10 border-t border-dark-400/10 pt-11">
        <div className="media-uploader-field">
          <div className="flex flex-col gap-4">
            <h3 className="h3-bold text-dark-600">Original</h3>

            <Link
              href={image.secureURL}
              target="_blank"
              className="overflow-hidden rounded-[10px]"
            >
              <Image
                src={image.secureURL}
                alt="original image"
                width={image.width}
                height={image.height}
                className="h-auto w-full object-contain"
              />
            </Link>
          </div>

          <TransformedImage
            image={image}
            type={image.transformationType}
            title={image.title}
            transformationConfig={image.config}
            isTransforming={false}
            hasDownload={true}
          />
        </div>

        {isAuthor && (
          <div className="mt-8 flex flex-col gap-4 md:flex-row md:justify-end">
            <Button
              nativeButton={false}
              render={<Link href={`/transformations/${image._id}/update`} />}
              className="button h-[44px] w-full md:h-[54px] md:w-fit"
            >
              Update Image
            </Button>

            <DeleteConfirmation imageId={image._id} />
          </div>
        )}
      </section>
    </>
  );
};

export default ImageDetails;