export default function Page({ params }: { params: { single_doctor: string } }) {
    return <div className="pt-20">
      My Post: {params.single_doctor}
      </div>
  }