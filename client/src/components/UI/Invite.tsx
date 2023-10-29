const Invite = () => {
  return (
    <>
      <div style={{ padding: "0 20px", textAlign: "center", color: "#757575" }}>
        <h1>Join Shift Software: Empowering Refugees in Switzerland</h1>
      </div>
      <div
        className="container"
        style={{
          width: "600px",
          margin: "0 auto",
          padding: "20px",
          backgroundColor: "#F0EFEB",
          color: " #fff",
          borderRadius: "5px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="header"
          style={{
            textAlign: "center",
            backgroundColor: "#F0EFEB",
            color: "#fff",
            padding: "10px",
            borderRadius: "5px 5px 0 0",
          }}
        >
          <div className="content" style={{ padding: "5px", color: "#757575" }}>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum
            </p>
            <p>
              Click the button below to access Shift Software and be part of
              this inspiring journey:
            </p>
            <p>
              <a href="{temporary_link}" className="button">
                Join Shift Software
              </a>
            </p>
            <p>
              We look forward to having you as a valuable member of our
              community.
            </p>
            <p>Sincerely,</p>
            <p>The Shift Software Team</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Invite;
