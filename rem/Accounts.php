<?
require_once('MyConnector.php');
class Accounts{		
	var $_db2;
	var $_db1;
	var $app_folder ='/directories';
	var $http='http://front-desk.ca';
	var $data_folder='/data';
	//var $pub_folder='';
	var $src = '/directories/dist/dir_test';
	var $https='https://frontdes-wwwss24.ssl.supercp.com';	
	var $login;

	
	function Accounts(Login $login){
			$this->login=$login;
	}
	
	private function db1(){				
				return $this->login->con();
	}	
	
	private function getFolder($id){
				$sql='SELECT folder FROM accounts WHERE id='.(int)$id;				
				$result = $this->login->con()->getAllAsObj($sql);
				if(count($result)) return $result[0]->folder;
				return 0;
	}
	
	private function db2($folder){
				if($this->_db2) return $this->_db2;
				$this->_db2 = new MyConnector($folder);					
			return $this->_db2;			
	}
	public function process($cmd,$get,$post){
			
			switch($cmd[0]){
					case 'server_url':
					$out = new stdClass();
					$out->success = 'http://front-desk.ca';
					$out->result='https://frontdes-wwwss24.ssl.supercp.com';
					return $out;
				break;				
				case 'get_all':
				return json_encode($this->getAll());
				break;
				case 'update':
				return $this->update(json_decode(file_get_contents("php://input")));
				break;
				case 'check_url':
				return json_encode($this->check_url($get['url']));
				break;	
				case 'create':			
				return json_encode($this->createAccount(json_decode(file_get_contents("php://input"))));
				break;		
				case 'start_create';				
				return json_encode($this->start_create());
				break;				
				case 'install';							
				return $this->install();
				break;
				case 'check_install';							
				return $this->check_install();
				break;
				case 'create_admins';
					$cfg = $this->getInstallConfig();
					$folder  = $cfg->folder;
				return $this->create_admins(json_decode(file_get_contents("php://input")),$folder);
				break;
				case 'register';							
				return $this->register();
				break;
				case 'send_email_notification';
					$cfg = $this->getInstallConfig();
					$folder  = $cfg->folder;
				return $this->send_email_notification($folder);
				break;
				case 'cancel_install';							
				return $this->cancel_install();
				break;
				case 'delete';							
				return json_encode($this->delete_account($get['id']));
				break;
				case 'get_info';							
				return $this->get_account_data($get['id']);
				break;	
				case 'create_config';
				return $this->create_config(json_decode(file_get_contents("php://input")));				
				break;				
				/*
				
				case 'add_admin';							
				return json_encode($this->add_admin($get['id'],$post));
				break;
				case 'update_admin';							
				return json_encode($this->update_admin($get['id'],$post));
				break;
				case 'delete_admin';							
				return json_encode($this->delete_admin($get['id'],$post));
				break;
				case 'update_config';							
				return json_encode($this->update_config($get['id'],file_get_contents("php://input")));
				break;
				case 'get_config';							
				return $this->get_config($get['id']);
				break;
				*/
				
			}
			
	}
	
	
	private function save_config($id,$data){
				$out= new stdClass();
				$folder = $this->getFolder($id);
				if($folder){
						$out->success = 'success';
						$out->result = file_put_contents(json_encode($data),$folder.'/data/config.json');
				}else {
					$out->error='error';
					$out->result = 'no id '.$id;
				}				
              
				return $out;
	
	}
	private function get_account_data($id){
				$out= new stdClass();				
				$folder = $this->getFolder($id);				
				if($folder){
						$folder = $_SERVER['DOCUMENT_ROOT'].$folder;
						if(file_exists($folder) && is_dir($folder)){															
								if(file_exists($folder.'/data/config.json') && file_exists($folder.'/data/directories.db')){
									$out->config=json_decode(file_get_contents($folder.'/data/config.json'));
									$sql = "SELECT name,email FROM users WHERE role = ?";
									$db = $this->db2($folder);								
									$res = $db->query($sql,array('admin'));
									$out->admins =  $res;
									$out->success = 'success';
																
								}else{
									return $this->delete_account($id);									
								}	
																
						}else{
							$out->error='error';
							$out->result = 'no folder '.$folder;
							return $out;
						}							
						
				}else {
					$out->error='error';
					$out->result = 'no namespace '.$id;
				}
				
				return $out;
	
	}	
		
	private function deleteDirectory($dir){
		
		return @rename($dir,$dir.'_'.time());
		//if (DIRECTORY_SEPARATOR == '/') $cmd = "rm -rf $dir";
		//else if (DIRECTORY_SEPARATOR == '\\')$cmd = "rd /s /q $dir";	
			//f($cmd) $res =  shell_exec($cmd);
		//return $cmd.' '.$res;				
	}
	
	private function cancel_install(){	
			$out= new stdClass();
			$id  =  $this->getInstallId();
			if($id){					
					$res = $this->delete_account($id);
					$this->resetInstall();
					$log=' cancel_install:'.json_encode($res);
					$this->log($log);				
					return $res;
					
			}
			$err = 'no_install_id '.$id;
			$this->logError($err);
			$out->error='no_install_id';
			$out->result = $id;
			return $out;
		/*	
			$folder = $this->login->getInstallFolder();			
			if($folder){
					$foder=$_SERVER['DOCUMENT_ROOT'].$folder;
						//f on linux use: rm -rf /dir
						////If on windows use: rd c:\dir /S /Q
				if(file_exists($folder) && is_dir($folder)){				
						$res=$this->deleteDirectory($folder);
						if($res){
							$this->login->setInstallFolder(0);
							$out->success='folder_removed';
							$out->result = $res;
						}else{
							$out->error='cant_remove_folder';
							$out->result = $folder;							
						}
				}else{
					$out->error='no folder';
					$out->result = $folder;
				}
				
			}else{
				$out->success='no_folder_yet';
				$out->result = 'cancel_install';
			}
			
			return $out;	
		 * */			
	}	
	
	
	private function getInstallConfig(){
		if(isset($_SESSION['install_cfg']) && $_SESSION['install_cfg']) return json_decode(file_get_contents($_SESSION['install_cfg']));
		return 0;
	}

	private function saveInstallCongig($cfg){
			if($cfg){
				$filename = '../temp/config_'.$this->getSuperId().'_'.time().'.json.tmp';
				$res  = file_put_contents($filename,json_encode($cfg));
				if($res){
					$_SESSION['install_cfg']= $filename;
					return 1;
				}else return 0;
			}else {
				$_SESSION['install_cfg']=0;
				return 1;
			}
	}	
		
	
	private function saveInstallId($id){
		$_SESSION['install_id']=$id;
	}
	private function getInstallId(){
		return isset($_SESSION['install_id'])?$_SESSION['install_id']:0;
	}
	
	
	private function getSuperId(){
		return $this->login->getUserId();
	}
	
	private function create_config($data){			
			$config = array();
			foreach($data as $item)	$config[$item->id] = $item->value;

			$config['folder']=$this->app_folder.'/'.$config['namespace'];
			$config['server']= 'http://front-desk.ca'.$config['folder'];
			$config['uid']=$this->getSuperId();
			$config['root'] = $_SERVER['DOCUMENT_ROOT'];
			$config['app'] = $this->app_folder;
			$config['src'] = $this->src;
			$config['data']='/data';
			$config['db'] = 'directories.db';
			$config['cfg']=$config['folder'].$config['data'].'/config.json';
			$config['https']='https://frontdes-wwwss24.ssl.supercp.com';

			$config['adminurl']=$config['https'].$config['folder'].'/Admin';
			$config['Admin'] = 'Admin';
			if(isset($config['KioskMobile']) && $config['KioskMobile']) $config['KioskMobile']='KioskMobile';
			if(isset($config['Kiosk1080']) && $config['Kiosk1080']) $config['Kiosk1080'] = 'Kiosk1080';
			if(isset($config['Kiosk1920']) && $config['Kiosk1920']) $config['Kiosk1920'] = 'Kiosk1920';

			$log = 'new config '.$config['namespace'];
			$this->log($log);
			$res = $this->saveInstallCongig($config);
						
			if($res)return $config;			
			else {
				$out= new stdClass();
				$out->error ='error save config';
				return $out;
			}
	}
	//////////////////////////////////////////////////////////////////////////////////////////
	
	
	
	private function start_create(){			
			$out= new stdClass();
			$this->log('start_create');
			$cfg = $this->getInstallConfig();
			if($cfg){
				$db = $this->db1();
				$res = $this->check_url($cfg->folder);
				if(isset($res->error)) return $res;
				$status='try';
				$ar = array($cfg->uid,$cfg->folder,'try',$cfg->account_name,$cfg->description,json_encode($cfg));				
				$sql="INSERT INTO accounts (user_id,folder,status,name,description,config) VALUES(?,?,?,?,?,?)";				
				$id = $db->insertRow($sql,$ar);
				$this->saveInstallId($id);
				$this->log('start_create install_id: '.$this->getInstallId());

				if($id){					
					$folder = $cfg->root.$cfg->folder;
					if(file_exists($folder)){
						$out->error='folder_exists';
						$this->logError('ERROR start_create folder_exists '.$folder);
						$out->result = $cfg->folder;
						return $out;
					}
					
					$res = @mkdir($folder, 0755);
					if(!$res){
						$out->error='cant_make_dir';
						$this->logError('ERROR start_create cant create '.$folder);
						$out->result=$folder;
						return $out;
					}
								
				}else {				
					$out->error='cant insert';
					$this->logError('start_create cant insert  '.$sql);					
					return $out;
				}				
			
				sleep(1);
				$cmd = "git --version 2>&1";
				$msg='';
				$msg.= shell_exec($cmd);
				$this->log($msg);
				$out->message = $this->getInstallId();
				$out->result = $cfg->namespace;
				sleep(3);
				$out->success='ready';
				
					return $out;
			}else{
				$this->logError('no_config_file');
				$out->error='no_config_file';
		 		$out->result = $_SESSION['data_install_cfg'];
			}		
					
		return $out;
	}
	
	private function install(){
		$this->log('install');
		set_time_limit(60);
			$cfg = $this->getInstallConfig();
			if($cfg){
					$root = $cfg->root;
					$src = $root.$cfg->src;			 
					$dest = $root.$cfg->folder;
					$this->log(" Install in folder From: $src to $dest");
					$cmd = "git clone -l  $src $dest 2>&1";
					$log='';		
					$log.= shell_exec($cmd);
					$this->log($log);
					sleep(1);
					$res = file_exists($dest);					
					if($res){
						$this->log('INSTALL_FINISHED');								
						return 'INSTALL_FINISHED';
					}else {
						$this->logError('error installing application cant create folder ');
						return 'error installing application cant create folder ';
					}			
			}					
			$this->logError('no_config');
			return 'no_config';			
	}	
	
	private function check_install(){
			$out= new stdClass();	
			$cfg = $this->getInstallConfig();					
			$ar= array();
			$ar[]=$cfg->data;
			if($cfg->KioskMobile)$ar[]=$cfg->KioskMobile.'.php';
			if($cfg->Kiosk1080)$ar[]=$cfg->Kiosk1080.'.php';
			if($cfg->Kiosk1920)$ar[]=$cfg->Kiosk1920.'.php';
			$ar[]=$cfg->Admin.'.php';
			$ar[]=$cfg->data.'/'.$cfg->db;
			$errors=array();			
			foreach($ar as $val) {
				$file_name = $cfg->root.$cfg->folder.'/'.$val;
					if(file_exists($file_name)){
						
					}
					else $errors[]=$file_name;
			}			
			if(count($errors)){
						$err = 'Nissing files '.implode(',',$errors);
						$this->logError($err);
						$out->error='missing_files';
						$out->result=$err;
						return $out;						
			}
			
			//$folder = $this->login->getInstallFolder();
			//$folder = $_SERVER['DOCUMENT_ROOT'].$folder;
			$file_name = $cfg->root.$cfg->folder.$cfg->data.'/config.json';
			$res = file_put_contents($file_name,json_encode($cfg));
			if($res){
				$log='check_complete:'.implode(',',$ar);
				$this->log($log);					
				$out->success='check_complete';
				$out->result = implode(',',$ar);
				//$out->message = $folder;
				return $out;
			}else{
				$err = 'cant_save_config:'.$file_name;
				$this->logError($err);
				$out->error='cant_save_config';
				//$out->result=$file_name;
				return $out;
			}			
			return 'ERROR check_install';				
	}
		
	private function create_admins($admins,$folder){
				$out= new stdClass();
				//$folder = $this->login->getInstallFolder();
				$cfg = $this->getInstallConfig();
				if($folder===0){
					$err='create_admins:no_folder';
					$this->logError($err);
					$out->error='nofolder';
					return $out;
				}	
				$folder = $cfg->root.$folder;
				$db = $this->db2($folder);				
				$sql ='INSERT INTO users (name,email,username,password,sendemail,role) VALUES(?,?,?,?,?,?)';				
				$stmt = $db->prepare($sql);
				if(!$stmt){
					$dberr= $db->errorInfo();
					$err = json_encode(dberr);
					$this->logError($err);				
					$out->error='prepare';
					$out->result = $dberr;
					return $out;
				}
				$sendemail = array();
				$names =array();
				foreach($admins as $user){
					if($user->sendemail) $sendemail[]=$user;
					$names[]=$user->name;
					$res = $stmt->execute(array($user->name,$user->email,$user->username,$user->password,$user->sendemail,'admin'));
					if(!$res) {
						$this->logError('insert admin '.json_encode($db->errorInfo()));
						$out->error='insertadmin';
						$out->result = $db->errorInfo();
						return $out;
					}
				}
				if(count($sendemail))	$out->success = 'admins_created_email';				
				else $out->success = 'admins_created';
				$out->result = implode(',',$names);
				$this->log($out->success.'  '.$out->result.' in folder '.$folder);
				$out->message = $folder;
				return $out;				
	}
	
	private function send_email_notification($folder){
				$out= new stdClass();
				if($folder===0){
					$out->error='nofolder';
					return $out;
				}
				$result=array();
				//$out=array();
				$db = $this->db2($_SERVER['DOCUMENT_ROOT'].$folder);
				$sql ='SELECT * FROM users';
				$result = $db->queryPure($sql)->fetchAll(PDO::FETCH_OBJ);
				
				$headers = 'From: admin@front-desk.ca' . "\r\n" .'Reply-To: admin@front-desk.ca' . "\r\n" .'X-Mailer: PHP/' . phpversion();
				$message='';
				$names=array();
				$serverNme=$_SERVER['SERVER_NAME'];
				foreach($result as $user){
						if($user->sendemail){
							$email= $user->email;
							$username=$user->username;
							$name = $user->name;
							$pass = $user->password;
							$url=$this->https.$folder;
							
							$text="Hi $name  You are registered as Administrator Kiosks Directories \r\n";

							$text.=$url."/Admin \r\n";
							$text.="username: $username \r\n";
							$text.="password: $pass \r\n";
							if($serverNme=='localhost'){
								$names[]= $email.'  username: '.$name.' password: '.$pass.'  url: '.$url;
								continue;
							};
							try{
								if(mail($email ,'Administrator account Kiosk Directories' ,$text,$headers))	$names[]= $email.':'.$name;
							  	else{
							  		$this->logError('email admins error '.$email.':'.$name);
							  		$out->error = 'email_error';	
									$out->result = $name;						  		
							  		return  $out;		
								}
							  
							}catch(Exception $e){								
								return $e;
							}
							
						}
				}			
				
				$this->log('email_sent:'.implode(',',$names));
				$out->success='email_sent';
				$out->result = implode(',',$names);					
				return $out;	
	}

	private function register(){
				$out= new stdClass();				
				$id =  $this->getInstallId();
				$sql="UPDATE accounts SET status='new' WHERE id=".$id;
				$db = $this->db1();
				$res = $db->queryPure($sql);				
				if($res){
					$log='registered'.$id.' set status new ';
					$this->log($log);				
					$out->success='registered';
					$out->result= $id;
					//$out->message = $this->login->getInstallFolder();
					$this->resetInstall();
				}
				else $out->error='redistration_error';
			return $out;
	}
	private function resetInstall(){
		$this->saveInstallId(0);
		$this->saveInstallCongig(0);
	}
	
	
	private function delete_account($id){
				$out= new stdClass();					
				$folder = $this->getFolder($id);			
				if($folder){			 
						$sql="UPDATE accounts SET status='del' WHERE id=".(int)$id;
						$res = $this->db1()->queryPure($sql);
						if($res){							
							$out->success = 'account_deleted';
							$folder = $_SERVER['DOCUMENT_ROOT'].$folder;
							if(file_exists($folder) && is_dir($folder)) {
								$res = $this->deleteDirectory($folder);
								if($res){							
									$out->result = 'folder_deleted';
									$out->message = $folder;
									return $out;
								}else{
									$out->result = 'cant_delete';
									$out->message = $folder;
								}
							}else{
								$out->result='no_folder';
								$out->message = $folder;
							}
						}else{
							$out->error='cant_delete';
							$out->result=$id;
						}
				}else {
					$out->error='no_folder_registered';
					$out->result=$id;
				}				
											
				
			return $out;
	}
	
	
		
	private function check_url($ns){
				$out= new stdClass();
				$sql="SELECT * FROM accounts WHERE folder=? AND status !='del'";
				//$ns = 	$get['url'];
				//if(is_numeric(substr($ns,0,1))) $ns='a'.$ns;
				//$root = $_SERVER['DOCUMENT_ROOT'];					 
				$dest = $this->app_folder.'/'.$ns;
				$ar=array($dest);
				$db = $this->db1();
				$result = $db->query($sql,$ar);
				
				if(count($result)===0)	{
					if(file_exists($_SERVER['DOCUMENT_ROOT'].$dest)){
						$remove= $this->deleteDirectory($_SERVER['DOCUMENT_ROOT'].$dest);
						$this->logError('ERRROOORRR !!!!! '.$_SERVER['DOCUMENT_ROOT'].$dest.' existt but not registered  removing directory result: '.$remove);
					}

						$out->success='OK';
						$out->result = $dest;
				}else {
					$out->error='exists';
					$out->message = 'Namespace '.$ns.' taken';
					/*'a'.$this->getSuperId().'-'.$ns;
					$dest = $this->pub.$ns;
					$ar=array($dest);
					$result = $db->query($sql,$ar);				
					if(count($result)===0){						
							$out->success='ISOK';
							$out->result = $ns;					
					}*/
				}
				return $out;
				
	}
	
	private function update($data){				
				$id = (int)$data->id;				
				//if($id===0) return $this->insert($data);
				$sql="UPDATE accounts SET name=?,description=? WHERE id=".$id;								
				$out= new stdClass();
				$out->success='updated';
				$db = $this->db1();
				$out->result = $db->updateRow($sql,array($data->name,$data->description));
				return $out;				
	
	}
	private function toArray($data){
			$name = isset($data['name'])?$data['name']:'name';
			$description = isset($data['description'])?$data['description']:'description';			
			return array($name,$description);		
	}
	private function getAll(){
		$id = $this->getSuperId();
		if($id==1) {
				$out= new stdClass();
				$out->success='welcome';
				$out->message='Please login with another username ';
				return $out;
		}
		$sql="SELECT id,name,description FROM accounts WHERE user_id=".$id." AND status !='del'";		
		return $this->db1()->getAllAsObj($sql);
	}
	/*
	private function insert($data){				
			$sql="INSERT INTO accounts (name,description,user_id) VALUES (?,?,?)";	
				$ar = $this->toArray($data);
				$ar[] = $this->user_id;				
			$out= new stdClass();
			$out->success='inserted';
			$out->result=$this->db->insertRow($sql,$ar);
			return $out;
	
	}
	*/
	private function filterData($data){
		$out = new stdClass();
		foreach($data as $key=>$val)$out->$key = mysql_real_escape_string($val);
		return $out;
	}
	
	private function getUserId(){
		return $this->login->getUserId();
	}
	
	function log($log){
		error_log("\r\n ".date("Y-m-d H:i:s").'  '.$log,3,'../logs/account_'.$this->getUserId().'.log');
	}

	function emailError($err){
		error_log($err,1,'uplight.ca@gmail.com');
	}
	
	function logError($err){
		error_log("\r\n ".date("Y-m-d H:i:s").'  '.$err,3,'../logs/ERROR_account_'.$this->getUserId().'.log');
	}
}