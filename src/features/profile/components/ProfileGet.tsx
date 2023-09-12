// DBのカラムにあわせた型情報
/*
type List = {
  id: UUID;
  created_at: string;
  role: string;
};
*/

/* const Home: NextPage = () => {
  const [list, setList] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      // sampleテーブルから全カラムのデータをid順に取得
      const { data, error } = await supabase
        .from<List>("profiles")
        .select("*")
        .order("id");

      if (error) {
        throw error;
      }
      if (data) {
        setList(data);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // supabaseからデータを取得
    fetchData();
  }, []);

  if (loading) return <div>loading...</div>;
  if (!list.length) return <div>missing data...</div>;

  return (
    <div className={styles.container}>
      <table>
        <thead>
          <tr>
            <td>Id</td>
            <td>Created_at</td>
            <td>Role</td>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.created_at}</td>
              <td>{item.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;

*/
