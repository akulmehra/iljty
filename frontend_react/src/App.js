import {useState, useEffect} from 'react';
import { Heading, Container, Button, ButtonGroup, Center, Input, Flex, Text, HStack, VStack, Box,
  FormControl,
  FormLabel } from '@chakra-ui/react'

function App() {
  const [name, setName] = useState("");
  const [gameCode, setGameCode] = useState(-1);
  const [clickedCreate, setClickedCreate] = useState(false);
  const [clickedJoin, setClickedJoin] = useState(false);
  const [lobbyActive, setlobbyActive] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [players, setPlayers] = useState([]);
  const [question1, setquestion1] = useState("");
  const [question2, setquestion2] = useState("");
  const [question3, setquestion3] = useState("");
  const [question4, setquestion4] = useState("");
  const [answer1, setanswer1] = useState("");
  const [answer2, setanswer2] = useState("");
  const [answer3, setanswer3] = useState("");
  const [answer4, setanswer4] = useState("");

  const SECOND_MS = 1000;

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameCode !== -1) {
        const fetchData = async () => {
          const data = await fetch(`http://localhost:8000/getPlayers/${gameCode}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            },
            mode: "cors",
            // body: JSON.stringify({
            //   gameCode: gameCode
            // })
          });

          const json = await data.json();
          setPlayers(json.players);
        }
        fetchData();
      }
    }, SECOND_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [gameCode])

  async function addQuestions() {
    const res = await fetch("http://localhost:8000/addQA", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      mode: "cors",
      body: JSON.stringify({
        gameCode: gameCode,
        playerName: name,
        questions: [question1, question2, question3, question4],
        answers: [answer1, answer2, answer3, answer4]
      })
    });

    if (res !== 200) {
      // TODO!: DO SOMETHING
    }

    setShowQuestions(true);
    setGameActive(false);
  }

  async function playGame() {
    const data = await fetch("http://localhost:8000/playGame", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      mode: "cors",
      body: JSON.stringify({
        gameCode: gameCode
      })
    });
    setlobbyActive(false);
    setGameActive(true);
  }

  async function joinNewGame() {
    const data = await fetch("http://localhost:8000/joinGame", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      mode: "cors",
      body: JSON.stringify({
        gameCode: gameCode,
        playerName: name
      })
    });

    setlobbyActive(true);
    console.log("HELLO, GAME IS ACTIVE");
  }

  async function startNewGame() {
    if (gameCode !== "" && name !== "") {
      let res = await fetch("http://localhost:8000/startNewGame", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        mode: "cors",
        body: JSON.stringify({
            gameCode: gameCode,
            playerName: name
        })
      });

      if (res !== 200) {
        // setlobbyActive(true);
        // TODO! DO SOMETHING
        
      }
        
      setlobbyActive(true);
      // console.log("HELLO, GAME IS ACTIVE");
    }
  }


  function createLobby() {
    let code = Math.floor(Math.random() * 1000);
    setGameCode(code);
    // console.log(gameCode);
    setClickedCreate(!clickedCreate);
    setClickedJoin(false);
  }

  function joinGame() {
    setClickedJoin(!clickedJoin);
    setClickedCreate(false);
  }

  return (
    <Container mt={20} className="App">
      <Heading as='h1' size='2xl'>
        I Literally Just Told You!
      </Heading>
      <Box display={(lobbyActive || gameActive || showQuestions) ? "none" : "block"}>
        <Center>
          <ButtonGroup mt={10} variant='outline' spacing='6'>
            <Button onClick={createLobby}>Create New Game</Button>
            <Button onClick={joinGame}>Join Game</Button>
          </ButtonGroup>
        </Center>
        <Flex mt={5} display={clickedCreate ? 'block' : 'none'}>
          <VStack>
            <HStack mr={5}>
              <Input placeholder='Enter your name' onChange={e => setName(e.target.value)} />
              <Button onClick={async () => {await startNewGame()}}>Start Game</Button>
            </HStack>
            <Text ml={5}>{gameCode} is your game code</Text>
          </VStack>
        </Flex>
        <Flex mt={5} display={clickedJoin ? 'block' : 'none'}>
            <HStack mr={5}>
              <Input placeholder='Enter your name' onChange={e => setName(e.target.value)} />
              <Input placeholder='Enter your game code' onChange={e => setGameCode(e.target.value)} />
              <Button onClick={async () => {await joinNewGame()}}>Join</Button>
            </HStack>
        </Flex>
      </Box>
      <Box mt={5} display={(lobbyActive && !gameActive) ? "block" : "none"}>
        <Text fontSize="xl">Game Code: {gameCode}</Text>
        <Heading size="md" mt={5}>Players in Game: </Heading>
        {players !== undefined && players.map(player => {
          return <Text>{player}</Text>
        })}
        <Button mt={5} colorScheme="green" size="lg" onClick={async () => {await playGame()}}>Play game</Button>
      </Box>

      <Box mt={5} display={(gameActive && !showQuestions) ? "block" : "none"}>
        <Text fontSize="xl">Game Code: {gameCode}</Text>
        <FormControl mt={10}>
          <FormLabel htmlFor='email'>Question 1</FormLabel>
          <Input mb={2} onChange={e => setquestion1(e.target.value)} type='text' placeholder="Enter Question" />
          <Input mt={2} onChange={e => setanswer1(e.target.value)} type='text' placeholder="Enter Answer" />
        </FormControl>
        <FormControl mt={10}>
          <FormLabel htmlFor='email'>Question 2</FormLabel>
          <Input mb={2} onChange={e => setquestion2(e.target.value)} type='text' placeholder="Enter Question" />
          <Input mt={2} onChange={e => setanswer2(e.target.value)} type='text' placeholder="Enter Answer" />
        </FormControl>
        <FormControl mt={10}>
          <FormLabel htmlFor='email'>Question 3</FormLabel>
          <Input mb={2} onChange={e => setquestion3(e.target.value)} type='text' placeholder="Enter Question" />
          <Input mt={2} onChange={e => setanswer3(e.target.value)} type='text' placeholder="Enter Answer" />
        </FormControl>
        <FormControl mt={10}>
          <FormLabel htmlFor='email'>Question 4</FormLabel>
          <Input mb={2} onChange={e => setquestion4(e.target.value)} type='text' placeholder="Enter Question" />
          <Input mt={2} onChange={e => setanswer4(e.target.value)} type='text' placeholder="Enter Answer" />
        </FormControl>
        <Button mt={5} mb={5} colorScheme="red" onClick={async () => {await addQuestions()}}>Submit</Button>
      </Box>
      <Box display={showQuestions ? "block" : "none"}>
        <Text>Show questions</Text>
      </Box>
    </Container>
  );
}

export default App;
