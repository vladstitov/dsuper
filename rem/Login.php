<?
class Login{
	var $conn;
	
	public function process($post){
		$out = new stdClass();			
		$cred= explode(',',$post['credetials']);
		$cmd = $cred[0];		
		$out->result=$cmd;		
		if($cmd == 'logout') return $this->logout();			
		else if($cmd =='login') return $this->_login($cred[1],$cred[2]);				
		else if($cmd == 'createuser') return $this->createUser($cred[1],$cred[2],$cred[3]);
		else if($cmd == 'checkuser') return $this->checkUser($cred[1]);
		
		return $out;
		
	}
	
	function isValid(){
		if(!isset($_GET['a'])){
			echo 'Hello World';
			return FALSE;
			
		}else if($this->getUserId())	return TRUE;
		else  if($_GET['a']=='login'){
				$cred = explode(',',$_POST['credetials']);
				$cmd = $cred[0];
				if($cmd == 'logout') echo json_encode($this->logout());					
				else if($cmd =='login') {
					$res= $this->_login($cred[1],$cred[2]);
					 echo (is_string($res)?$res:json_encode($res));
				}
								
		} 
		return FALSE;		
	
	}
	function keepData($data,$index){
		$filename = '../temp/'.$index.$this->getUserId().'_'.time().'json';		
		$res = file_put_contents($filename, json_encode($data));
		if($res) {
			 $_SESSION['data_'.$index] = $filename;
			return TRUE;
		}
		return FALSE;	
	}	
	function killData($index){
		if(isset( $_SESSION['data_'.$index])){
			$filename = $_SESSION['data_'.$index];
			unlink($filename);
			$_SESSION['data_'.$index]=0;
		}		
	}
	function getData($index){		
		if(isset($_SESSION['data_'.$index]) && $_SESSION['data_'.$index]!==0) return json_decode(file_get_contents($_SESSION['data_'.$index]));
		return 0;
	}

	function getUser(){
		$id = $this->getUserId();
		if($id){
			$res = $this->con()->query('SELECT * FROM users WHERE id=?',array($id));
			if(count($res)==1) return $res[0];			
		}
		return 0;;
	}
	function getUserId(){
		return isset($_SESSION['directories_userid'])?$_SESSION['directories_userid']:0;
	}
	function setUserId($id){
		$_SESSION['directories_userid']=$id;
	}
	function setRole($role){
		$_SESSION['directories_role'] = $role;
	}
	function getRole(){
		return isset($_SESSION['directories_role'])?$_SESSION['directories_role']:0;
	}
	function setInstallFolder($folder){
		$_SESSION['install_folder']=$folder;
	}
	function getInstallFolder(){
		return isset($_SESSION['install_folder'])?$_SESSION['install_folder']:0;
	}
	function setCurrentAccountId($id){
		$_SESSION['accoun_id']=$id;
	}
	function getCurrentAccountId(){
		return isset($_SESSION['accoun_id'])?$_SESSION['accoun_id']:0;
	}

	private function createUser($username,$pass,$email){
			$out = new stdClass();
			$user = $this->getUser();
			
			if($user && $user->status!=='welcome'){
				$out->success='hacker';					
				return $out;	
			}					
			$exists = $this->checkUserNmae($username);
			if($exists->success=='taken')	return $exists ;			
			
			$ip = $_SERVER['REMOTE_ADDR'];
			$role='newuser';
			$url=$user->url;
			$conn = $this->con();			
			$sql = "INSERT INTO users (username,pass,status,url,ip,email) VALUES (?,?,?,?,?,?)";
			
			$id = $conn->insertRow($sql,array($username,$pass,$role,$url,$ip,$email));			
			if($id){
				$out->success='usercreated';				
				$out->result=$url.'#'.$username;
				
				$this->setRole($role);
				$this->setUserId($id);							
			}else{			
				$out->error='createerror';
				$out->result=$id;
				
			}			
			return $out;	
	}
	
	private function checkUserNmae($username){
		$out = new stdClass();	
		$conn = $this->con();		
		$sql = "SELECT * FROM users WHERE username=?";		
		$result = $conn->query($sql,array($username));		
		if(count($result) === 0){
				$out->success='spare';
				$out->result =  $username;
				return $out;
		}
		$out->success='taken';
		$out->result =  $username;		
		return $out;
	}
	private function _login($user,$pass){
			$out = new stdClass();
			if(isset($_SESSION['login_count']))	$_SESSION['login_count']++;
			else $_SESSION['login_count']=1;
			$num = $_SESSION['login_count'];					
			if($num>100){
				if($num>10000){
					if(time()-$num>100)	{
						$_SESSION['login_count']=0;							
					}
				}			
			
				$out->error='blocked';
				$out->result=$num;
				$_SESSION['login_count'] = time();
				return $out;
			}
					
			$conn = $this->con();		
		$sql = "SELECT id,status,url FROM users WHERE username=? AND pass=?";
		$result = $conn->query($sql,array($user,$pass));
		
		if ($result && count($result) === 1){
				$row = $result[0];
			if($row->status == 'welcome'){
				$this->setUserId($row->id);				
				$out->success='welcome';
				$out->result = $row->url;	
			}else{
				$this->setRole($row->status);
				$this->setUserId($row->id);			
				$out->success='loggedin';
				$out->result = $row->url;
			}
				
		}else {
				
				$out->error='wrong';
				$out->result =  count($result);			
		}		
			return $out;
	}
	private function logout(){
			$out = new stdClass();
			if($this->getUserId())	{
				$_SESSION['login_count']=0;
				$this->setRole(0);
				$this->setUserId(0);
				$out->success='logout';
				$out->result='User Logout';
			}else{
				$out->success='logout';
			}						
			
			return $out;
	}
	
	function con(){
			if(!$this->conn){
				$this->conn =new MyConnector(FALSE);
			} 
			return $this->conn;
	}

}