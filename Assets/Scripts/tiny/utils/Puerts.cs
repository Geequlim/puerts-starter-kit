namespace tiny
{
	public class PuertsUtils
	{
		public static Puerts.ArrayBuffer Bytes2Buffer(byte[] bytes)
		{
			return new Puerts.ArrayBuffer(bytes);
		}

		public static byte[] Buffer2Bytes(Puerts.ArrayBuffer buffer)
		{
			return buffer.Bytes;
		}
	}
}
